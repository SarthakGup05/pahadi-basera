import { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const { tag, search, verifiedOnly } = req.query;

    const whereClause: any = {};

    if (verifiedOnly === 'true') {
      whereClause.isVerifiedCreator = true;
    }

    if (tag) {
      whereClause.tags = {
        has: tag as string
      };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { excerpt: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
        { authorName: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const blogs = await prisma.blogPost.findMany({
      where: whereClause,
      include: {
        authorUser: {
          select: {
            id: true,
            fullName: true,
            referralCode: true,
            kycStatus: true,
            role: true,
            socialProfile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(blogs);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch blogs', details: error.message });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const blog = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        authorUser: {
          select: {
            id: true,
            fullName: true,
            referralCode: true,
            kycStatus: true,
            role: true,
            socialProfile: true
          }
        }
      }
    });

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    return res.status(200).json(blog);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch blog post', details: error.message });
  }
};

// Create a new post (Only Verified Creators or Admins)
export const createBlogPost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify creator authorization
    if (user.role !== 'BLOGGER' && user.role !== 'ADMIN') {
      return res.status(403).json({ 
        error: 'Only Verified Himalayan Bloggers with approved KYC can publish travel logs.' 
      });
    }

    const {
      title,
      excerpt,
      content,
      altitude,
      duration,
      difficulty,
      bestSeason,
      tags,
      gearList,
      images,
      taggedPropertyId
    } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({ error: 'Title, excerpt, and content are required' });
    }

    const newPost = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        altitude: altitude || '2,400m',
        duration: duration || '3 Days',
        difficulty: difficulty || 'Moderate',
        bestSeason: bestSeason || 'Autumn & Spring',
        tags: Array.isArray(tags) ? tags : ['Himalayas', 'Verified Trail'],
        gearList: Array.isArray(gearList) ? gearList : ['Trekking poles', 'Water filter'],
        routeCoordinates: [],
        images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop'],
        authorName: user.fullName || user.email.split('@')[0],
        authorRole: 'Verified Himalayan Creator',
        authorAvatar: user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        authorId: user.id,
        isVerifiedCreator: true,
        taggedPropertyId: taggedPropertyId || null
      }
    });

    return res.status(201).json({
      message: 'Travel story published to the Himalayan Journal!',
      post: newPost
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to create blog post', details: error.message });
  }
};

// Like / Upvote a blog post
export const likeBlogPost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        likesCount: { increment: 1 }
      }
    });
    return res.status(200).json({ likesCount: post.likesCount });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to upvote blog post' });
  }
};
