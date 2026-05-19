-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "about" TEXT,
ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cancellationPolicy" TEXT,
ADD COLUMN     "checkInTime" TEXT,
ADD COLUMN     "checkOutTime" TEXT,
ADD COLUMN     "maxGuests" INTEGER DEFAULT 1,
ADD COLUMN     "petsAllowed" BOOLEAN DEFAULT false,
ADD COLUMN     "securityDeposit" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "selfCheckIn" TEXT,
ADD COLUMN     "smokingPolicy" TEXT,
ADD COLUMN     "space" TEXT;
