import { Request, Response } from 'express';
import { prisma } from '../db/prisma..js'; // Import configured prisma instance
import { AuthRequest } from '../middleware/auth.middleware.js';


const normalizePropertyType = (typeStr: string): any => {
  if (!typeStr) return undefined;
  const formatted = typeStr.trim().toUpperCase().replace(/\s+/g, '_');
  const validTypes = ['RESORT', 'VILLAS', 'CASTLE', 'HOMESAYS', 'COTTAGE', 'GUEST_HOUSE', 'APARTMENT'];
  if (validTypes.includes(formatted)) {
    return formatted;
  }
  return undefined;
};

export const getProperties = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const whereClause: any = { isActive: true };

    if (type) {
      const normalizedType = normalizePropertyType(type as string);
      if (normalizedType) {
        whereClause.type = normalizedType;
      }
    }

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        images: {
          where: { isFeatured: true },
          take: 1
        },
        services: true 
      }
    });

    res.status(200).json(properties);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch properties', details: error.message });
  }
};

export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      title, 
      description, 
      rules, 
      latitude, 
      longitude, 
      altitude, 
      basePrice, 
      type,
      location,
      bedrooms,
      bathrooms,
      about,
      space,
      amenities,
      checkInTime,
      checkOutTime,
      selfCheckIn,
      maxGuests,
      petsAllowed,
      smokingPolicy,
      securityDeposit,
      cancellationPolicy
    } = req.body;
    const user = req.user!; 

    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only registered hosts can create properties' });
    }

    if (!type) {
      return res.status(400).json({ error: 'Property type is required' });
    }

    const normalizedType = normalizePropertyType(type);
    if (!normalizedType) {
      return res.status(400).json({ 
        error: `Invalid property type. Must be one of: resort, villas, castle, homesays, cottage, guest house, apartment` 
      });
    }

    const property = await prisma.property.create({
      data: {
        hostId: user.userId,
        title,
        description,
        rules,
        latitude: parseFloat(latitude as string),
        longitude: parseFloat(longitude as string),
        altitude: parseFloat(altitude as string),
        basePrice: parseFloat(basePrice as string),
        type: normalizedType,
        location,
        bedrooms: bedrooms !== undefined && bedrooms !== null ? parseInt(bedrooms as string) : undefined,
        bathrooms: bathrooms !== undefined && bathrooms !== null ? parseInt(bathrooms as string) : undefined,
        about,
        space,
        amenities: Array.isArray(amenities) ? amenities : undefined,
        checkInTime,
        checkOutTime,
        selfCheckIn,
        maxGuests: maxGuests !== undefined && maxGuests !== null ? parseInt(maxGuests as string) : undefined,
        petsAllowed: petsAllowed !== undefined && petsAllowed !== null ? (petsAllowed === true || petsAllowed === 'true') : undefined,
        smokingPolicy,
        securityDeposit: securityDeposit !== undefined && securityDeposit !== null ? parseFloat(securityDeposit as string) : undefined,
        cancellationPolicy
      }
    });

    res.status(201).json({ message: 'Property created successfully', property });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create property', details: error.message });
  }
};

//update property
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      id, 
      title, 
      description, 
      rules, 
      latitude, 
      longitude, 
      altitude, 
      basePrice, 
      type,
      location,
      bedrooms,
      bathrooms,
      about,
      space,
      amenities,
      checkInTime,
      checkOutTime,
      selfCheckIn,
      maxGuests,
      petsAllowed,
      smokingPolicy,
      securityDeposit,
      cancellationPolicy
    } = req.body;
    const user = req.user!; 

    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only registered hosts can update properties' });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (rules !== undefined) updateData.rules = rules;
    if (latitude !== undefined) updateData.latitude = parseFloat(latitude as string);
    if (longitude !== undefined) updateData.longitude = parseFloat(longitude as string);
    if (altitude !== undefined) updateData.altitude = parseFloat(altitude as string);
    if (basePrice !== undefined) updateData.basePrice = parseFloat(basePrice as string);

    if (type) {
      const normalizedType = normalizePropertyType(type);
      if (!normalizedType) {
        return res.status(400).json({ 
          error: `Invalid property type. Must be one of: resort, villas, castle, homesays, cottage, guest house, apartment` 
        });
      }
      updateData.type = normalizedType;
    }

    if (location !== undefined) updateData.location = location;
    if (bedrooms !== undefined) {
      updateData.bedrooms = bedrooms !== null ? parseInt(bedrooms as string) : null;
    }
    if (bathrooms !== undefined) {
      updateData.bathrooms = bathrooms !== null ? parseInt(bathrooms as string) : null;
    }

    if (about !== undefined) updateData.about = about;
    if (space !== undefined) updateData.space = space;
    if (amenities !== undefined) {
      updateData.amenities = Array.isArray(amenities) ? amenities : [];
    }
    if (checkInTime !== undefined) updateData.checkInTime = checkInTime;
    if (checkOutTime !== undefined) updateData.checkOutTime = checkOutTime;
    if (selfCheckIn !== undefined) updateData.selfCheckIn = selfCheckIn;
    if (maxGuests !== undefined) {
      updateData.maxGuests = maxGuests !== null ? parseInt(maxGuests as string) : null;
    }
    if (petsAllowed !== undefined) {
      updateData.petsAllowed = petsAllowed !== null ? (petsAllowed === true || petsAllowed === 'true') : null;
    }
    if (smokingPolicy !== undefined) updateData.smokingPolicy = smokingPolicy;
    if (securityDeposit !== undefined) {
      updateData.securityDeposit = securityDeposit !== null ? parseFloat(securityDeposit as string) : null;
    }
    if (cancellationPolicy !== undefined) updateData.cancellationPolicy = cancellationPolicy;

    const property = await prisma.property.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({ message: 'Property updated successfully', property });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update property', details: error.message });
  }
};


//update property by id
export const updatePropertyById = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      title, 
      description, 
      rules, 
      latitude, 
      longitude, 
      altitude, 
      basePrice, 
      type,
      location,
      bedrooms,
      bathrooms,
      about,
      space,
      amenities,
      checkInTime,
      checkOutTime,
      selfCheckIn,
      maxGuests,
      petsAllowed,
      smokingPolicy,
      securityDeposit,
      cancellationPolicy
    } = req.body;
    const id = req.params.id || req.body.id;
    const user = req.user!; 

    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only registered hosts can update properties' });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (rules !== undefined) updateData.rules = rules;
    if (latitude !== undefined) updateData.latitude = parseFloat(latitude as string);
    if (longitude !== undefined) updateData.longitude = parseFloat(longitude as string);
    if (altitude !== undefined) updateData.altitude = parseFloat(altitude as string);
    if (basePrice !== undefined) updateData.basePrice = parseFloat(basePrice as string);

    if (type) {
      const normalizedType = normalizePropertyType(type);
      if (!normalizedType) {
        return res.status(400).json({ 
          error: `Invalid property type. Must be one of: resort, villas, castle, homesays, cottage, guest house, apartment` 
        });
      }
      updateData.type = normalizedType;
    }

    if (location !== undefined) updateData.location = location;
    if (bedrooms !== undefined) {
      updateData.bedrooms = bedrooms !== null ? parseInt(bedrooms as string) : null;
    }
    if (bathrooms !== undefined) {
      updateData.bathrooms = bathrooms !== null ? parseInt(bathrooms as string) : null;
    }

    if (about !== undefined) updateData.about = about;
    if (space !== undefined) updateData.space = space;
    if (amenities !== undefined) {
      updateData.amenities = Array.isArray(amenities) ? amenities : [];
    }
    if (checkInTime !== undefined) updateData.checkInTime = checkInTime;
    if (checkOutTime !== undefined) updateData.checkOutTime = checkOutTime;
    if (selfCheckIn !== undefined) updateData.selfCheckIn = selfCheckIn;
    if (maxGuests !== undefined) {
      updateData.maxGuests = maxGuests !== null ? parseInt(maxGuests as string) : null;
    }
    if (petsAllowed !== undefined) {
      updateData.petsAllowed = petsAllowed !== null ? (petsAllowed === true || petsAllowed === 'true') : null;
    }
    if (smokingPolicy !== undefined) updateData.smokingPolicy = smokingPolicy;
    if (securityDeposit !== undefined) {
      updateData.securityDeposit = securityDeposit !== null ? parseFloat(securityDeposit as string) : null;
    }
    if (cancellationPolicy !== undefined) updateData.cancellationPolicy = cancellationPolicy;

    const property = await prisma.property.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({ message: 'Property updated successfully', property });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update property', details: error.message });
  }
};


//delete property
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.body;
    const user = req.user!; 

    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only registered hosts can delete properties' });
    }

    const property = await prisma.property.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Property deleted successfully', property });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete property', details: error.message });
  }
};    

//delete property by id
export const deletePropertyById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only registered hosts can delete properties' });
    }

    const property = await prisma.property.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Property deleted successfully', property });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete property', details: error.message });
  }
};

//get my properties
export const getMyProperties = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { type } = req.query;

    const whereClause: any = { hostId: user.userId };

    if (type) {
      const normalizedType = normalizePropertyType(type as string);
      if (normalizedType) {
        whereClause.type = normalizedType;
      }
    }

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        images: {
          where: { isFeatured: true },
          take: 1
        },
        services: true
      }
    });

    res.status(200).json(properties);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch properties', details: error.message });
  }
};



//search properties
export const searchProperties = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { title: { contains: q as string, mode: 'insensitive' } },
          { description: { contains: q as string, mode: 'insensitive' } },
        ],
        isActive: true
      },
      include: {
        images: {
          where: { isFeatured: true },
          take: 1
        },
        services: true
      }
    });

    res.status(200).json(properties);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to search properties', details: error.message });
  }
};

//get property by id
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: true,
        services: true,
        reviews: {
          include: {
            user: true
          }
        },
        bookings: true
      }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json(property);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch property', details: error.message });
  }
};

//get featured properties
export const getFeaturedProperties = async (req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      where: { isFeatured: true },
      include: {
        images: {
          where: { isFeatured: true },
          take: 1
        },
        services: true
      }
    });

    res.status(200).json(properties);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch properties', details: error.message });
  }
};

//get popular properties
export const getPopularProperties = async (req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      where: { isPopular: true },
      include: {
        images: {
          where: { isFeatured: true },
          take: 1
        },
        services: true
      }
    });

    res.status(200).json(properties);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch properties', details: error.message });
  }
};

/**
 * Calculates a detailed stay quotation for a user.
 * Supports computing total cost both with and without a 5% tax.
 * Note: Taxes are applied only to stay and service costs (refundable security deposits are tax-exempt).
 */
export const calculateQuotation = async (req: Request, res: Response) => {
  try {
    const { propertyId, checkIn, checkOut, selectedServices } = req.body;

    if (!propertyId || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'propertyId, checkIn, and checkOut are required.' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ error: 'Invalid check-in or check-out date format.' });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ error: 'Check-out date must be strictly after check-in date.' });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { services: true }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    // Calculate nights
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const basePricePerNight = property.basePrice;
    const baseStayCost = basePricePerNight * nights;
    const securityDeposit = property.securityDeposit || 0;

    let servicesCost = 0;
    const servicesBreakdown = [];

    if (Array.isArray(selectedServices) && selectedServices.length > 0) {
      for (const item of selectedServices) {
        const { serviceId, quantity } = item;
        const service = property.services.find(s => s.id === serviceId || s.id === `${propertyId}-${serviceId}`);

        if (service) {
          const parsedQty = quantity ? parseInt(quantity.toString(), 10) : 1;
          const subtotal = service.pricePerUnit * parsedQty;
          servicesCost += subtotal;

          servicesBreakdown.push({
            serviceId: service.id,
            serviceType: service.serviceType,
            pricePerUnit: service.pricePerUnit,
            quantity: parsedQty,
            subtotal
          });
        }
      }
    }

    // Taxes (5%) are calculated on stay and service totals (security deposit is excluded)
    const taxableAmount = baseStayCost + servicesCost;
    const taxRate = 0.05;
    const taxAmount = parseFloat((taxableAmount * taxRate).toFixed(2));

    const totalWithoutTaxes = baseStayCost + servicesCost + securityDeposit;
    const totalWithTaxes = totalWithoutTaxes + taxAmount;

    return res.status(200).json({
      propertyId,
      title: property.title,
      nights,
      basePricePerNight,
      baseStayCost,
      securityDeposit,
      servicesCost,
      servicesBreakdown,
      taxableAmount,
      taxRate,
      taxAmount,
      totalWithoutTaxes,
      totalWithTaxes
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to calculate quotation', details: error.message });
  }
};

