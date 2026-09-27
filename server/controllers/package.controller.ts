import type { Request, Response } from 'express';
import { prisma } from '../db/prisma..js';

// Get all active packages (Public)
export const getPackages = async (req: Request, res: Response) => {
  try {
    const packages = await prisma.package.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        num: 'asc'
      }
    });
    res.status(200).json(packages);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch packages' });
  }
};

// Get all packages (Admin panel, includes inactive)
export const getAdminPackages = async (req: Request, res: Response) => {
  try {
    const packages = await prisma.package.findMany({
      orderBy: {
        num: 'asc'
      }
    });
    res.status(200).json(packages);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch packages for admin' });
  }
};

// Get package by ID (Public & Admin)
export const getPackageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pkg = await prisma.package.findUnique({
      where: { id: id as string }
    });

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.status(200).json(pkg);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch package details' });
  }
};

// Create a new package (Admin only)
export const createPackage = async (req: Request, res: Response) => {
  try {
    const {
      num,
      title,
      region,
      location,
      duration,
      durationDays,
      vibe,
      difficulty,
      price,
      maxGuests,
      image,
      badge,
      description,
      longDescription,
      amenities,
      includes,
      altitude,
      bestTime,
      itinerary
    } = req.body;

    // Validation
    if (!title || !region || !price || !duration) {
      return res.status(400).json({ error: 'Title, region, price, and duration are required' });
    }

    const pkg = await prisma.package.create({
      data: {
        num: num || '01',
        title,
        region,
        location: location || '',
        duration,
        durationDays: Number(durationDays) || 1,
        vibe: vibe || 'Adventure',
        difficulty: difficulty || 'Easy',
        price: parseFloat(price),
        maxGuests: Number(maxGuests) || 4,
        image: image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        badge: badge || null,
        description: description || '',
        longDescription: longDescription || '',
        amenities: Array.isArray(amenities) ? amenities : [],
        includes: includes || [],
        altitude: altitude || '',
        bestTime: bestTime || '',
        itinerary: itinerary || [],
        isActive: true
      }
    });

    res.status(201).json(pkg);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create package' });
  }
};

// Update an existing package (Admin only)
export const updatePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert types if they are present in request
    if (updateData.price !== undefined) updateData.price = parseFloat(updateData.price);
    if (updateData.durationDays !== undefined) updateData.durationDays = Number(updateData.durationDays);
    if (updateData.maxGuests !== undefined) updateData.maxGuests = Number(updateData.maxGuests);

    const updated = await prisma.package.update({
      where: { id: id as string },
      data: updateData
    });

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update package' });
  }
};

// Toggle package status active/inactive (Admin only)
export const togglePackageActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const pkg = await prisma.package.findUnique({
      where: { id: id as string }
    });

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const updated = await prisma.package.update({
      where: { id: id as string },
      data: {
        isActive: !pkg.isActive
      }
    });

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to toggle package status' });
  }
};

// Delete a package (Admin only)
export const deletePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.package.delete({
      where: { id: id as string }
    });

    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete package' });
  }
};
