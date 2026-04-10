import { z } from "zod/v4";

export const setRoleSchema = z.object({
  role: z.enum(["FARMER", "BUYER"]),
  phone: z.string().min(8).max(20).optional(),
});

export const createFarmerProfileSchema = z.object({
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be a 6-digit number"),
  village: z.string().optional(),
  cropTypes: z.array(z.string()).min(1, "At least one crop type is required"),
  profilePhoto: z.string().url().optional(),
});

export const updateFarmerProfileSchema = createFarmerProfileSchema.partial();

export type SetRoleInput = z.infer<typeof setRoleSchema>;
export type CreateFarmerProfileInput = z.infer<typeof createFarmerProfileSchema>;
export type UpdateFarmerProfileInput = z.infer<typeof updateFarmerProfileSchema>;
