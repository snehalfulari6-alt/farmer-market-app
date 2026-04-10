import { prisma } from "../../lib/prisma";
import type {
  CreateFarmerProfileInput,
  UpdateFarmerProfileInput,
} from "./profile.schema";

export async function setUserRole(
  userId: string,
  role: "FARMER" | "BUYER",
  phone?: string,
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      role,
      ...(phone ? { phone } : {}),
    },
  });
}

export async function getUserWithProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      farmerProfile: true,
      buyerProfile: true,
    },
  });

  if (!user) return null;

  const profile =
    user.role === "FARMER"
      ? user.farmerProfile
      : user.role === "BUYER"
        ? user.buyerProfile
        : null;

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
      role: user.role,
    },
    profile,
    hasProfile: !!profile,
  };
}

export async function createFarmerProfile(
  userId: string,
  data: CreateFarmerProfileInput,
) {
  return prisma.$transaction(async (tx) => {
    const profile = await tx.farmerProfile.create({
      data: {
        userId,
        state: data.state,
        district: data.district,
        pincode: data.pincode,
        village: data.village,
        cropTypes: data.cropTypes,
        profilePhoto: data.profilePhoto,
      },
    });

    if (data.profilePhoto) {
      await tx.user.update({
        where: { id: userId },
        data: { image: data.profilePhoto },
      });
    }

    return profile;
  });
}

export async function updateFarmerProfile(
  userId: string,
  data: UpdateFarmerProfileInput,
) {
  return prisma.farmerProfile.update({
    where: { userId },
    data,
  });
}

export async function getFarmerProfile(userId: string) {
  return prisma.farmerProfile.findUnique({
    where: { userId },
  });
}

export async function getUserRole(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role ?? null;
}
