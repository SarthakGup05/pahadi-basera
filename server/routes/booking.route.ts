import { Router } from 'express';
import {
  createBooking,
  confirmBookingPayment,
  cancelBooking,
  getBookingById,
  getMyBookings,
  getPropertyBookings
} from '../controllers/booking.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// All booking routes require authentication
router.use(requireAuth);

// --- Booking Transactions ---
router.post('/create-booking', createBooking);
router.post('/confirm-payment', confirmBookingPayment);
router.put('/cancel-booking', cancelBooking);
router.put('/cancel-booking/:id', cancelBooking);

// --- Booking Retrievals ---
router.get('/my-bookings', getMyBookings);
router.get('/property-bookings', getPropertyBookings);
router.get('/get-booking/:id', getBookingById);

export default router;
