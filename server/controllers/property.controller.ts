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
    const { title, description, rules, latitude, longitude, altitude, basePrice, type } = req.body;
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
        latitude,
        longitude,
        altitude,
        basePrice,
        type: normalizedType
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
    const { id, title, description, rules, latitude, longitude, altitude, basePrice, type } = req.body;
    const user = req.user!; 

    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only registered hosts can update properties' });
    }

    const updateData: any = {
      title,
      description,
      rules,
      latitude,
      longitude,
      altitude,
      basePrice
    };

    if (type) {
      const normalizedType = normalizePropertyType(type);
      if (!normalizedType) {
        return res.status(400).json({ 
          error: `Invalid property type. Must be one of: resort, villas, castle, homesays, cottage, guest house, apartment` 
        });
      }
      updateData.type = normalizedType;
    }

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
    const { id, title, description, rules, latitude, longitude, altitude, basePrice, type } = req.body;
    const user = req.user!; 

    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only registered hosts can update properties' });
    }

    const updateData: any = {
      title,
      description,
      rules,
      latitude,
      longitude,
      altitude,
      basePrice
    };

    if (type) {
      const normalizedType = normalizePropertyType(type);
      if (!normalizedType) {
        return res.status(400).json({ 
          error: `Invalid property type. Must be one of: resort, villas, castle, homesays, cottage, guest house, apartment` 
        });
      }
      updateData.type = normalizedType;
    }

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
