import { z } from "zod/v4";

const optionalNumber = z
  .union([z.number(), z.string()])
  .transform((v) => Number(v))
  .refine((v) => !Number.isNaN(v), "Must be a valid number");

export const createListingSchema = z.object({
  cropName: z.string().min(1, "Crop name is required"),
  categoryId: z.string().optional(),
  quantity: optionalNumber,
  unit: z.string().min(1, "Unit is required"),
  pricePerUnit: optionalNumber,
  grade: z.string().optional(),
  harvestDate: z.string().datetime().optional(),
  availableFrom: z.string().datetime().optional(),
  photos: z.array(z.string().url()).default([]),
  description: z.string().optional(),
  latitude: optionalNumber.optional(),
  longitude: optionalNumber.optional(),
  locationName: z.string().optional(),
  status: z.enum(["ACTIVE", "SOLD", "DELETED"]).optional(),
});

export const updateListingSchema = createListingSchema.partial();

export const listListingQuerySchema = z.object({
  status: z.enum(["ACTIVE", "SOLD", "DELETED"]).optional(),
  categoryId: z.string().optional(),
  cropName: z.string().optional(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type ListListingQueryInput = z.infer<typeof listListingQuerySchema>;
