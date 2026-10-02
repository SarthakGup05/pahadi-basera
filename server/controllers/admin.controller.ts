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

    const pendingCreatorsCount = await prisma.user.count({
      where: { 
        kycStatus: 'PENDING',
        OR: [
          { aadhaarNumber: { not: null } },
          { bio: { not: null } },
          { socialProfile: { not: null } }
        ]
      }
    });

    const verifiedCreatorsCount = await prisma.user.count({
      where: { role: 'BLOGGER' }
    });

    const totalDispatchesCount = await prisma.blogPost.count();

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
        activePackages,
        pendingCreatorsCount,
        verifiedCreatorsCount,
        totalDispatchesCount
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

/**
 * Super Admin: Get all pending creator onboarding applications
 */
export const getPendingCreators = async (req: AuthRequest, res: Response) => {
  try {
    const pending = await prisma.user.findMany({
      where: {
        kycStatus: 'PENDING',
        OR: [
          { aadhaarNumber: { not: null } },
          { bio: { not: null } },
          { socialProfile: { not: null } }
        ]
      },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        socialProfile: true,
        aadhaarNumber: true,
        digilockerVerified: true,
        kycStatus: true,
        upiId: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { updatedAt: 'desc' }
    });
    return res.status(200).json(pending);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch pending creator applications', details: error.message });
  }
};

/**
 * Super Admin: Get all active/onboarded creators
 */
export const getOnboardedCreators = async (req: AuthRequest, res: Response) => {
  try {
    const creators = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'BLOGGER' },
          { kycStatus: 'VERIFIED', referralCode: { not: null } }
        ]
      },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        socialProfile: true,
        role: true,
        kycStatus: true,
        kycVerifiedAt: true,
        referralCode: true,
        commissionRate: true,
        upiId: true,
        totalEarnings: true,
        pendingBalance: true,
        createdAt: true,
        _count: {
          select: {
            blogPosts: true,
            referralEarnings: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(creators);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch onboarded creators', details: error.message });
  }
};

/**
 * Super Admin: Approve creator onboarding application
 */
export const approveCreatorOnboarding = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: 'Creator application not found' });
    }

    // Generate unique referral code if missing
    let referralCode = user.referralCode;
    if (!referralCode) {
      let unique = false;
      const cleanName = (user.fullName || 'HIMALAYA').replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 6) || 'HIMA';
      while (!unique) {
        const candidate = `${cleanName}${Math.floor(100 + Math.random() * 900)}`;
        const check = await prisma.user.findUnique({ where: { referralCode: candidate } });
        if (!check) {
          referralCode = candidate;
          unique = true;
        }
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        kycStatus: 'VERIFIED',
        role: user.role === 'ADMIN' ? 'ADMIN' : 'BLOGGER',
        digilockerVerified: true,
        kycVerifiedAt: new Date(),
        referralCode,
        commissionRate: 0.08
      }
    });

    await prisma.notification.create({
      data: {
        title: 'Creator Onboarding Approved',
        desc: `Super Admin approved onboarding for ${updated.fullName || updated.email}. Referral code: ${referralCode}`,
        type: 'kyc',
        unread: true
      }
    });

    return res.status(200).json({
      message: 'Creator application approved successfully! Creator is now onboarded and active.',
      creator: updated
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to approve creator', details: error.message });
  }
};

/**
 * Super Admin: Reject creator onboarding application
 */
export const rejectCreatorOnboarding = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'Creator application not found' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        kycStatus: 'REJECTED'
      }
    });

    return res.status(200).json({
      message: 'Creator application rejected.',
      creator: updated
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to reject creator', details: error.message });
  }
};

/**
 * Super Admin: Toggle creator role (e.g. BLOGGER <-> GUEST) or revoke privileges
 */
export const toggleCreatorRole = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    if (user.role === 'ADMIN' || user.email.toLowerCase() === 'admin@pahadibasera.com') {
      return res.status(400).json({ error: 'Cannot alter role of Super Admin account.' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        role: role === 'BLOGGER' ? 'BLOGGER' : 'GUEST'
      }
    });

    return res.status(200).json({
      message: `Creator status updated to ${updated.role}`,
      creator: updated
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update creator role', details: error.message });
  }
};

/**
 * Super Admin: Get all creator dispatches & content for review
 */
export const getAllCreatorDispatches = async (req: AuthRequest, res: Response) => {
  try {
    const dispatches = await prisma.blogPost.findMany({
      include: {
        authorUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
            referralCode: true,
            kycStatus: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(dispatches);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch creator dispatches', details: error.message });
  }
};

/**
 * Super Admin: Delete creator dispatch
 */
export const deleteCreatorDispatch = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: 'Dispatch not found' });
    }
    await prisma.blogPost.delete({ where: { id } });
    return res.status(200).json({ message: 'Dispatch removed from Himalayan Journal.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete dispatch', details: error.message });
  }
};

/**
 * Super Admin: Toggle verification/featured status on creator dispatch
 */
export const toggleDispatchVerification = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: 'Dispatch not found' });
    }
    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        isVerifiedCreator: !post.isVerifiedCreator
      }
    });
    return res.status(200).json({
      message: `Dispatch ${updated.isVerifiedCreator ? 'marked as verified/featured' : 'unmarked'}`,
      post: updated
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to toggle dispatch verification', details: error.message });
  }
};
