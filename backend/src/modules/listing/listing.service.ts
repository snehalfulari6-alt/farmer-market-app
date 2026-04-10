import { prisma } from "../../lib/prisma";
import type {
  CreateListingInput,
  ListListingQueryInput,
  UpdateListingInput,
} from "./listing.schema";

export async function getFarmerProfileIdByUserId(userId: string) {
  const profile = await prisma.farmerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  return profile?.id ?? null;
}

export async function createListing(farmerId: string, data: CreateListingInput) {
  return prisma.listing.create({
    data: {
      farmerId,
      cropName: data.cropName,
      categoryId: data.categoryId,
      quantity: data.quantity,
      unit: data.unit,
      pricePerUnit: data.pricePerUnit,
      grade: data.grade,
      harvestDate: data.harvestDate ? new Date(data.harvestDate) : undefined,
      availableFrom: data.availableFrom ? new Date(data.availableFrom) : undefined,
      photos: data.photos,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      locationName: data.locationName,
      status: data.status,
    },
    include: {
      category: true,
    },
  });
}

export async function listListings(farmerId: string, query: ListListingQueryInput) {
  return prisma.listing.findMany({
    where: {
      farmerId,
      ...(query.status ? { status: query.status } : { status: { not: "DELETED" } }),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.cropName
        ? { cropName: { contains: query.cropName, mode: "insensitive" } }
        : {}),
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getListingById(farmerId: string, listingId: string) {
  return prisma.listing.findFirst({
    where: {
      id: listingId,
      farmerId,
    },
    include: {
      category: true,
    },
  });
}

export async function updateListing(
  farmerId: string,
  listingId: string,
  data: UpdateListingInput,
) {
  const listing = await getListingById(farmerId, listingId);
  if (!listing) return null;

  return prisma.listing.update({
    where: { id: listingId },
    data: {
      ...(data.cropName !== undefined ? { cropName: data.cropName } : {}),
      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
      ...(data.quantity !== undefined ? { quantity: data.quantity } : {}),
      ...(data.unit !== undefined ? { unit: data.unit } : {}),
      ...(data.pricePerUnit !== undefined ? { pricePerUnit: data.pricePerUnit } : {}),
      ...(data.grade !== undefined ? { grade: data.grade } : {}),
      ...(data.harvestDate !== undefined
        ? { harvestDate: data.harvestDate ? new Date(data.harvestDate) : null }
        : {}),
      ...(data.availableFrom !== undefined
        ? { availableFrom: data.availableFrom ? new Date(data.availableFrom) : null }
        : {}),
      ...(data.photos !== undefined ? { photos: data.photos } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.latitude !== undefined ? { latitude: data.latitude } : {}),
      ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
      ...(data.locationName !== undefined ? { locationName: data.locationName } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
    },
    include: {
      category: true,
    },
  });
}

export async function softDeleteListing(farmerId: string, listingId: string) {
  const listing = await getListingById(farmerId, listingId);
  if (!listing) return null;

  return prisma.listing.update({
    where: { id: listingId },
    data: { status: "DELETED" },
  });
}
