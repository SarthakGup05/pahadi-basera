import { Request, Response } from 'express';
import { prisma } from '../db/prisma..js';

export const getTrails = async (req: Request, res: Response) => {
  try {
    const trails = await prisma.communityTrail.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(trails);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch community trails', details: error.message });
  }
};

export const getThreads = async (req: Request, res: Response) => {
  try {
    const threads = await prisma.communityThread.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(threads);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch community threads', details: error.message });
  }
};

export const getRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await prisma.localRecipe.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return res.status(200).json(recipes);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch local recipes', details: error.message });
  }
};

export const createThread = async (req: Request, res: Response) => {
  try {
    const { title, category, authorName, authorAvatar } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const thread = await prisma.communityThread.create({
      data: {
        id: `thread-${Date.now()}`,
        title,
        category,
        authorName: authorName || 'Guest Explorer',
        authorAvatar: authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&q=80',
        replies: 0,
        upvotes: 1
      }
    });

    return res.status(201).json(thread);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to create discussion thread', details: error.message });
  }
};

export const upvoteThread = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const thread = await prisma.communityThread.findUnique({
      where: { id }
    });

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const updatedThread = await prisma.communityThread.update({
      where: { id },
      data: {
        upvotes: {
          increment: 1
        }
      }
    });

    return res.status(200).json(updatedThread);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to upvote thread', details: error.message });
  }
};
