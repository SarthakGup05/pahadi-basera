-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ServiceType" ADD VALUE 'LOCAL_CHEF';
ALTER TYPE "ServiceType" ADD VALUE 'FOREST_SAUNA';
ALTER TYPE "ServiceType" ADD VALUE 'NATIVE_GUIDE';

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "bathrooms" INTEGER DEFAULT 1,
ADD COLUMN     "bedrooms" INTEGER DEFAULT 1,
ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "label" TEXT;
