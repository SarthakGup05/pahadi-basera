import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { prisma } from '../db/prisma.js';

/**
 * Creates a new booking using a strict Prisma interactive transaction.
 * Supports both Basera Stays (propertyId) and Curated Expeditions (packageId).
 * Re-verifies availability inside the database lock to guarantee race-condition safety,
 * and processes all financials strictly on the server-side to prevent client tampering.
 */
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      propertyId, 
      packageId, 
      checkIn, 
      checkOut, 
      selectedServices, 
      specialRequests,
      guestsCount = 1 
    } = req.body;
    const user = req.user!; // AuthRequest user

    if (!propertyId && !packageId) {
      return res.status(400).json({ error: 'Either propertyId or packageId is required.' });
    }

    if (!checkIn) {
      return res.status(400).json({ error: 'checkIn date is required.' });
    }

    const checkInDate = new Date(checkIn);
    if (isNaN(checkInDate.getTime())) {
      return res.status(400).json({ error: 'Invalid check-in date format.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkInDate < today) {
      return res.status(400).json({ error: 'Check-in date cannot be in the past.' });
    }

    const guests = Math.max(1, parseInt(guestsCount.toString(), 10) || 1);

    // Run interactive transaction for race-condition isolation
    const newBooking = await prisma.$transaction(async (tx) => {
      // ───────────────────────────────────────────────
      // A. PACKAGE EXPEDITION BOOKING FLOW
      // ───────────────────────────────────────────────
      if (packageId) {
        // Find package by ID or num / slug
        const pkg = await tx.package.findFirst({
          where: {
            OR: [
              { id: packageId },
              { num: packageId }
            ]
          }
        });

        if (!pkg) {
          throw new Error('PACKAGE_NOT_FOUND');
        }
        if (!pkg.isActive) {
          throw new Error('PACKAGE_NOT_ACTIVE');
        }

        // Calculate checkout date from package duration if not provided
        let checkOutDate: Date;
        if (checkOut) {
          checkOutDate = new Date(checkOut);
          if (isNaN(checkOutDate.getTime()) || checkOutDate <= checkInDate) {
            checkOutDate = new Date(checkInDate.getTime() + (pkg.durationDays || 3) * 24 * 60 * 60 * 1000);
          }
        } else {
          checkOutDate = new Date(checkInDate.getTime() + (pkg.durationDays || 3) * 24 * 60 * 60 * 1000);
        }

        // Compute Package Financials Server-Side
        const baseStayCost = pkg.price * guests;
        
        let servicesCost = 0;
        if (Array.isArray(selectedServices) && selectedServices.length > 0) {
          for (const item of selectedServices) {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 1;
            servicesCost += price * quantity;
          }
        }

        // 5% Tax on taxable items (base stay + accessory services)
        const subtotal = baseStayCost + servicesCost;
        const taxAmount = Math.round(subtotal * 0.05);
        const securityDeposit = 5000; // Flat tax-exempt refundable security deposit
        const totalCost = subtotal + taxAmount + securityDeposit;

        const booking = await tx.booking.create({
          data: {
            guestId: user.userId,
            packageId: pkg.id,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            baseStayCost,
            servicesCost,
            securityDeposit,
            totalCost,
            guestsCount: guests,
            status: 'PENDING',
            specialRequests: specialRequests || null,
          },
          include: {
            package: {
              select: {
                title: true,
                price: true,
                duration: true,
                location: true,
              }
            }
          }
        });

        // Trigger in-app notification for Super Admin
        await tx.notification.create({
          data: {
            title: 'New Package Expedition Reserved',
            desc: `Guest reserved "${pkg.title}" starting ${checkInDate.toLocaleDateString('en-IN')} for ₹${totalCost.toLocaleString('en-IN')}.`,
            type: 'package',
            unread: true
          }
        });

        return booking;
      }

      // ───────────────────────────────────────────────
      // B. BASERA HOMESTAY / CHALET BOOKING FLOW
      // ───────────────────────────────────────────────
      if (!checkOut) {
        throw new Error('CHECKOUT_REQUIRED');
      }

      const checkOutDate = new Date(checkOut);
      if (isNaN(checkOutDate.getTime())) {
        throw new Error('INVALID_CHECKOUT_DATE');
      }

      if (checkInDate >= checkOutDate) {
        throw new Error('CHECKOUT_MUST_BE_AFTER_CHECKIN');
      }

      // 1. Fetch Property details and lock/fetch within transaction
      const property = await tx.property.findUnique({
        where: { id: propertyId },
        include: { services: true }
      });

      if (!property) {
        throw new Error('PROPERTY_NOT_FOUND');
      }

      if (!property.isActive) {
        throw new Error('PROPERTY_NOT_ACTIVE');
      }

      // 2. Strict concurrency check inside transaction isolation scope
      const overlappingBooking = await tx.booking.findFirst({
        where: {
          propertyId,
          status: { in: ['CONFIRMED', 'PENDING'] },
          AND: [
            { checkIn: { lt: checkOutDate } },
            { checkOut: { gt: checkInDate } }
          ]
        }
      });

      if (overlappingBooking) {
        throw new Error('DATES_ALREADY_BOOKED');
      }

      // 3. Server-side Financial Calculations
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const baseStayCost = property.basePrice * nights;
      const securityDeposit = property.securityDeposit || 0;

      let servicesCost = 0;
      const servicesDataToCreate = [];

      if (Array.isArray(selectedServices) && selectedServices.length > 0) {
        for (const item of selectedServices) {
          const { serviceId, quantity } = item;
          const service = property.services.find(s => s.id === serviceId || s.id === `${propertyId}-${serviceId}`);

          if (!service) {
            throw new Error(`SERVICE_NOT_FOUND:${serviceId}`);
          }
          if (!service.isAvailable) {
            throw new Error(`SERVICE_UNAVAILABLE:${service.serviceType}`);
          }

          const parsedQty = quantity ? parseInt(quantity.toString(), 10) : 1;
          const serviceCost = service.pricePerUnit * parsedQty;
          servicesCost += serviceCost;

          servicesDataToCreate.push({
            serviceId: service.id,
            priceAtTime: service.pricePerUnit,
            quantity: parsedQty
          });
        }
      }

      const subtotal = baseStayCost + servicesCost;
      const taxAmount = Math.round(subtotal * 0.05); // 5% VAT / GST
      const totalCost = subtotal + taxAmount + securityDeposit;

      // 4. Record Booking
      const booking = await tx.booking.create({
        data: {
          guestId: user.userId,
          propertyId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          baseStayCost,
          servicesCost,
          securityDeposit,
          totalCost,
          guestsCount: guests,
          status: 'PENDING',
          specialRequests: specialRequests || null,
          selectedServices: {
            create: servicesDataToCreate
          }
        },
        include: {
          selectedServices: {
            include: {
              service: true
            }
          },
          property: {
            select: {
              title: true,
              basePrice: true,
              securityDeposit: true
            }
          }
        }
      });

      // In-app Notification for Platform / Host
      await tx.notification.create({
        data: {
          title: 'New Basera Stay Reserved',
          desc: `Reservation placed for "${property.title}" (${nights} nights) starting ${checkInDate.toLocaleDateString('en-IN')}.`,
          type: 'booking',
          unread: true
        }
      });

      return booking;
    });

    return res.status(201).json({
      message: 'Booking initialized successfully. Awaiting payment.',
      booking: newBooking
    });

  } catch (error: any) {
    if (error.message === 'PROPERTY_NOT_FOUND') {
      return res.status(404).json({ error: 'Property not found.' });
    }
    if (error.message === 'PACKAGE_NOT_FOUND') {
      return res.status(404).json({ error: 'Package expedition not found.' });
    }
    if (error.message === 'PROPERTY_NOT_ACTIVE' || error.message === 'PACKAGE_NOT_ACTIVE') {
      return res.status(400).json({ error: 'This listing is currently inactive and cannot be booked.' });
    }
    if (error.message === 'CHECKOUT_REQUIRED') {
      return res.status(400).json({ error: 'checkOut date is required for property bookings.' });
    }
    if (error.message === 'CHECKOUT_MUST_BE_AFTER_CHECKIN') {
      return res.status(400).json({ error: 'Check-out date must be strictly after check-in date.' });
    }
    if (error.message === 'DATES_ALREADY_BOOKED') {
      return res.status(409).json({ error: 'The requested check-in dates have already been booked.' });
    }
    if (error.message.startsWith('SERVICE_NOT_FOUND')) {
      const sId = error.message.split(':')[1];
      return res.status(400).json({ error: `Selected service with ID ${sId} does not belong to this property.` });
    }
    if (error.message.startsWith('SERVICE_UNAVAILABLE')) {
      const sType = error.message.split(':')[1];
      return res.status(400).json({ error: `The requested service (${sType}) is currently unavailable.` });
    }

    return res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
};

/**
 * Confirms payment for a pending booking.
 * Changes the status to CONFIRMED.
 */
export const confirmBookingPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId } = req.body;
    const user = req.user!;

    if (!bookingId) {
      return res.status(400).json({ error: 'bookingId is required.' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { 
        property: true,
        package: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Authorization: only the guest, the property host, or an admin can confirm payment
    const isGuest = booking.guestId === user.userId;
    const isHost = booking.property ? booking.property.hostId === user.userId : false;
    const isAdmin = user.role === 'ADMIN';

    if (!isGuest && !isHost && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to confirm payment for this booking.' });
    }

    if (booking.status !== 'PENDING') {
      return res.status(400).json({ error: `Booking status is already ${booking.status}.` });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' }
    });

    return res.status(200).json({
      message: 'Payment confirmed successfully. Booking is now CONFIRMED.',
      booking: updatedBooking
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to confirm payment', details: error.message });
  }
};

/**
 * Cancels an existing booking.
 */
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const id = (req.params.id || req.body.id) as string;
    const user = req.user!;

    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required.' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { 
        property: true,
        package: true 
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const isGuest = booking.guestId === user.userId;
    const isHost = booking.property ? booking.property.hostId === user.userId : false;
    const isAdmin = user.role === 'ADMIN';

    if (!isGuest && !isHost && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking.' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Booking has already been cancelled.' });
    }

    if (booking.status === 'COMPLETED') {
      return res.status(400).json({ error: 'Completed bookings cannot be cancelled.' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    return res.status(200).json({
      message: 'Booking cancelled successfully.',
      booking: updatedBooking
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to cancel booking', details: error.message });
  }
};

/**
 * Retrieves a single booking by ID.
 */
export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required.' });
    }
    const user = req.user!;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        property: true,
        package: true,
        selectedServices: {
          include: {
            service: true
          }
        },
        guest: {
          select: {
            id: true,
            email: true,
            phoneNumber: true,
            fullName: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const isGuest = booking.guestId === user.userId;
    const isHost = booking.property ? booking.property.hostId === user.userId : false;
    const isAdmin = user.role === 'ADMIN';

    if (!isGuest && !isHost && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to view this booking.' });
    }

    return res.status(200).json(booking);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve booking', details: error.message });
  }
};

/**
 * Retrieves all bookings made by the active guest.
 */
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    const bookings = await prisma.booking.findMany({
      where: { guestId: user.userId },
      include: {
        property: {
          select: {
            title: true,
            basePrice: true,
            securityDeposit: true,
            location: true,
            images: { take: 1, select: { url: true } }
          }
        },
        package: {
          select: {
            title: true,
            price: true,
            duration: true,
            location: true,
            image: true
          }
        },
        selectedServices: {
          include: {
            service: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(bookings);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve bookings', details: error.message });
  }
};

/**
 * Retrieves all bookings on properties owned by the active host.
 */
export const getPropertyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only registered hosts or admins can view property bookings.' });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        property: {
          hostId: user.userId
        }
      },
      include: {
        property: {
          select: {
            title: true,
            location: true
          }
        },
        guest: {
          select: {
            email: true,
            phoneNumber: true,
            fullName: true
          }
        },
        selectedServices: {
          include: {
            service: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(bookings);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve property bookings', details: error.message });
  }
};
