import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors'; // Handles async errors in express routes
import authRoutes from './routes/auth.route.js';
import propertyRoutes from './routes/property.route.js';
import bookingRoutes from './routes/booking.route.js';
import blogRoutes from './routes/blog.route.js';
import communityRoutes from './routes/community.route.js';

import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// Global Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads

// Basic Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to Pahadi Basera API' });
});



// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/community', communityRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
