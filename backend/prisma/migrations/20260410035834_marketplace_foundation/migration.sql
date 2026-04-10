/*
  Warnings:

  - You are about to drop the `friend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `friendRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('FARMER', 'BUYER');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "friend" DROP CONSTRAINT "friend_friendId_fkey";

-- DropForeignKey
ALTER TABLE "friend" DROP CONSTRAINT "friend_userId_fkey";

-- DropForeignKey
ALTER TABLE "friendRequest" DROP CONSTRAINT "friendRequest_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "friendRequest" DROP CONSTRAINT "friendRequest_senderId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" "UserRole";

-- DropTable
DROP TABLE "friend";

-- DropTable
DROP TABLE "friendRequest";

-- DropEnum
DROP TYPE "friendRequestStatus";

-- CreateTable
CREATE TABLE "farmer_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "village" TEXT,
    "cropTypes" TEXT[],
    "aadhaarNumber" TEXT,
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "profilePhoto" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "walletBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farmer_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyer_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addresses" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "farmer_profile_userId_key" ON "farmer_profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "buyer_profile_userId_key" ON "buyer_profile"("userId");

-- AddForeignKey
ALTER TABLE "farmer_profile" ADD CONSTRAINT "farmer_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_profile" ADD CONSTRAINT "buyer_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
