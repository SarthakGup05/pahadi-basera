import { Request, Response } from 'express';
import { prisma } from '../db/prisma..js';

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const { tag, search } = req.query;

    const whereClause: any = {};

    if (tag) {
      whereClause.tags = {
        has: tag as string
      };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { excerpt: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const blogs = await prisma.blogPost.findMany({
      where: whereClause,
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
      where: { id }
    });

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    return res.status(200).json(blog);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch blog post', details: error.message });
  }
};
