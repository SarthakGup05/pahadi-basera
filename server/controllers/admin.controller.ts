import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { prisma } from '../db/prisma.js';
import { BookingStatus, PropertyType } from '../generated/prisma/index.js';

/**
 * Fetch consolidated dashboard metrics, recent activities, and Recharts datasets.
 */
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    // 1. Calculate General Counters
    const totalUsers = await prisma.user.count();
    
    // Group users by roles
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { id: true },
    });

    const activeStays = await prisma.property.count({
      where: { isActive: true },
    });
    
    const totalStays = await prisma.property.count();

    const bookingsCount = await prisma.booking.count();

    const totalPackages = await prisma.package.count();
    const activePackages = await prisma.package.count({
      where: { isActive: true }
    });

    // 2. Financial Metrics
    // Calculate total revenue from Confirmed & Completed bookings
    const revenueSum = await prisma.booking.aggregate({
      where: {
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
        },
      },
      _sum: {
        totalCost: true,
      },
    });
    
    const totalRevenue = revenueSum._sum.totalCost || 0;

    // 3. Time Series Data (Past 6 months or 12 months)
    // For simplicity and client charting, we will pull all bookings for the past year and aggregate by month in JS.
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: twelveMonthsAgo,
        },
      },
      select: {
        createdAt: true,
        totalCost: true,
        status: true,
      },
    });

    // Populate a 12-month array
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStatsMap = new Map<string, { month: string; bookings: number; revenue: number }>();
    
    for (let i = 0; i < 12; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mName = monthNames[d.getMonth()];
      const year = d.getFullYear();
      const key = `${mName} ${year}`;
      monthlyStatsMap.set(key, { month: key, bookings: 0, revenue: 0 });
    }

    // Process DB bookings into months
    bookings.forEach((booking) => {
      const bDate = new Date(booking.createdAt);
      const mName = monthNames[bDate.getMonth()];
      const year = bDate.getFullYear();
      const key = `${mName} ${year}`;
      
      if (monthlyStatsMap.has(key)) {
        const current = monthlyStatsMap.get(key)!;
        current.bookings += 1;
        if (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.COMPLETED) {
          current.revenue += booking.totalCost;
        }
        monthlyStatsMap.set(key, current);
      }
    });

    // Convert map to sorted chronological array
    const monthlyStats = Array.from(monthlyStatsMap.values()).reverse();

    // 4. Region Distribution (Group properties by location/city name)
    const properties = await prisma.property.findMany({
      select: {
        location: true,
        type: true,
      },
    });

    const regionMap: { [key: string]: number } = {};
    const typeMap: { [key in PropertyType]?: number } = {};

    properties.forEach((property) => {
      // Region parser: e.g., "Manali, Himachal Pradesh" -> "Manali"
      const region = property.location ? property.location.split(',')[0].trim() : 'Unknown';
      regionMap[region] = (regionMap[region] || 0) + 1;
      
      const type = property.type;
      typeMap[type] = (typeMap[type] || 0) + 1;
    });

    const regionStats = Object.entries(regionMap).map(([name, count]) => ({
      name,
      value: count,
    }));

    const typeStats = Object.entries(typeMap).map(([name, count]) => ({
      name,
      value: count,
    }));

    // 5. Recent Activity Feed (Recent Bookings with user and property details)
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        guest: {
          select: {
            email: true,
            phoneNumber: true,
          },
        },
        property: {
          select: {
            title: true,
            location: true,
          },
        },
        package: {
          select: {
            title: true,
            location: true,
          },
        },
      },
    });

    return res.status(200).json({
      counters: {
        totalUsers,
        activeStays,
        totalStays,
        bookingsCount,
        totalRevenue,
        usersByRole,
        totalPackages,
        activePackages
      },
      monthlyStats,
      regionStats,
      typeStats,
      recentBookings,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to aggregate dashboard analytics',
      details: error.message,
    });
  }
};

/**
 * Get all properties listed on the platform with host details (Super Admin control).
 */
export const getAllProperties = async (req: AuthRequest, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        host: {
          select: {
            email: true,
            phoneNumber: true,
            kycStatus: true,
          },
        },
      },
    });
    return res.status(200).json(properties);
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to fetch properties ledger',
      details: error.message,
    });
  }
};

/**
 * Toggle property active state (moderation / publishing).
 */
export const togglePropertyActive = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found.' });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        isActive: !property.isActive,
      },
    });

    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to toggle property active state',
      details: error.message,
    });
  }
};

/**
 * Get all bookings across the platform with detailed guest and property information.
 */
export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        guest: {
          select: {
            email: true,
            phoneNumber: true,
          },
        },
        property: {
          select: {
            title: true,
            location: true,
          },
        },
        package: {
          select: {
            title: true,
            location: true,
          },
        },
        selectedServices: {
          include: {
            service: true,
          },
        },
      },
    });
    return res.status(200).json(bookings);
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to fetch bookings ledger',
      details: error.message,
    });
  }
};

/**
 * Update the status of any booking manually.
 */
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!status || !Object.values(BookingStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid or missing booking status.' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: status as BookingStatus,
      },
    });

    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to update booking status',
      details: error.message,
    });
  }
};
