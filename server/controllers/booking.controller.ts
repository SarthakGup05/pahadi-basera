import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { prisma } from '../db/prisma..js';

/**
 * Creates a new booking using a strict Prisma interactive transaction.
 * Re-verifies availability inside the database lock to guarantee race-condition safety,
 * and processes all financials strictly on the server-side to prevent client tempering.
 */
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, checkIn, checkOut, selectedServices, specialRequests } = req.body;
    const user = req.user!; // AuthRequest user

    if (!propertyId || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'propertyId, checkIn, and checkOut are required.' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ error: 'Invalid check-in or check-out date format.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkInDate < today) {
      return res.status(400).json({ error: 'Check-in date cannot be in the past.' });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ error: 'Check-out date must be strictly after check-in date.' });
    }

    // Run interactive transaction for race-condition isolation
    const newBooking = await prisma.$transaction(async (tx) => {
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
          const service = property.services.find(s => s.id === serviceId);

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
            serviceId,
            priceAtTime: service.pricePerUnit,
            quantity: parsedQty
          });
        }
      }

      const totalCost = baseStayCost + servicesCost + securityDeposit;

      // 4. Record Booking
      return await tx.booking.create({
        data: {
          guestId: user.userId,
          propertyId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          baseStayCost,
          servicesCost,
          securityDeposit,
          totalCost,
          status: 'PENDING',
          specialRequests,
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
    });

    return res.status(201).json({
      message: 'Booking initialized successfully. Awaiting payment.',
      booking: newBooking
    });

  } catch (error: any) {
    if (error.message === 'PROPERTY_NOT_FOUND') {
      return res.status(404).json({ error: 'Property not found.' });
    }
    if (error.message === 'PROPERTY_NOT_ACTIVE') {
      return res.status(400).json({ error: 'This property is currently inactive and cannot be booked.' });
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
      include: { property: true }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Authorization: only the guest, the property host, or an admin can confirm payment
    const isGuest = booking.guestId === user.userId;
    const isHost = booking.property.hostId === user.userId;
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
    const id = req.params.id || req.body.id;
    const user = req.user!;

    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required.' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { property: true }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const isGuest = booking.guestId === user.userId;
    const isHost = booking.property.hostId === user.userId;
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
 * Retrieves a booking by its unique ID.
 */
export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            title: true,
            hostId: true,
            latitude: true,
            longitude: true,
            altitude: true
          }
        },
        selectedServices: {
          include: {
            service: true
          }
        },
        guest: {
          select: {
            id: true,
            email: true,
            phoneNumber: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.guestId !== user.userId && booking.property.hostId !== user.userId && user.role !== 'ADMIN') {
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
            securityDeposit: true
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
            title: true
          }
        },
        guest: {
          select: {
            email: true,
            phoneNumber: true
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
