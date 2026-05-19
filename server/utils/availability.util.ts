import { prisma } from '../db/prisma..js';

/**
 * Checks if a requested check-in and check-out date range is available for a property.
 * An overlap exists if the requested check-in is strictly before an existing check-out
 * AND the requested check-out is strictly after an existing check-in.
 * Only CONFIRMED and PENDING bookings block dates.
 *
 * @param propertyId The unique ID of the property
 * @param checkIn The requested check-in Date object
 * @param checkOut The requested check-out Date object
 * @returns Promise<boolean> True if available, false if there is an overlap
 */
export const checkPropertyAvailability = async (
  propertyId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> => {
  // Prevent logical errors in dates
  if (checkIn >= checkOut) {
    throw new Error('Check-out date must be strictly after check-in date.');
  }

  const overlappingBooking = await prisma.booking.findFirst({
    where: {
      propertyId,
      status: { in: ['CONFIRMED', 'PENDING'] },
      AND: [
        { checkIn: { lt: checkOut } },   // New check-in is before existing check-out
        { checkOut: { gt: checkIn } }    // New check-out is after existing check-in
      ]
    }
  });

  // If an overlapping booking is found, the property is not available
  return !overlappingBooking;
};
