import type { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';

// Fetch all notifications sorted by newest first
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.status(200).json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch notifications' });
  }
};

// Mark all unread notifications as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: {
        unread: true
      },
      data: {
        unread: false
      }
    });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to mark notifications as read' });
  }
};

// Mark a single notification as read by ID
export const markSingleAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: {
        id: id as string
      },
      data: {
        unread: false
      }
    });
    res.status(200).json(notification);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to mark notification as read' });
  }
};

// Create a new notification
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { title, desc, type } = req.body;
    
    if (!title || !desc || !type) {
      return res.status(400).json({ error: 'Title, desc, and type are required' });
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        desc,
        type,
        unread: true
      }
    });
    res.status(201).json(notification);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create notification' });
  }
};
