/*
  Warnings:

  - You are about to drop the column `aadhaarNumber` on the `farmer_profile` table. All the data in the column will be lost.
  - You are about to drop the column `kycStatus` on the `farmer_profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "farmer_profile" DROP COLUMN "aadhaarNumber",
DROP COLUMN "kycStatus",
ADD COLUMN     "pincode" TEXT;

-- DropEnum
DROP TYPE "KycStatus";
