/*
  Warnings:

  - Added the required column `type` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('RESORT', 'VILLAS', 'CASTLE', 'HOMESAYS', 'COTTAGE', 'GUEST_HOUSE', 'APARTMENT');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "type" "PropertyType" NOT NULL;
