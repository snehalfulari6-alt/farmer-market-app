import { Router } from "express";
import { requireAuth } from "../../lib/require-auth";
import {
  setRoleSchema,
  createFarmerProfileSchema,
  updateFarmerProfileSchema,
} from "./profile.schema";
import {
  setUserRole,
  getUserWithProfile,
  createFarmerProfile,
  updateFarmerProfile,
  getFarmerProfile,
  getUserRole,
} from "./profile.service";

export const profileRouter = Router();

// All profile routes require authentication
profileRouter.use(requireAuth);

// Set user role (after signup)
profileRouter.post("/set-role", async (req, res) => {
  try {
    const parsed = setRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const userId = req.user!.id;
    const user = await setUserRole(userId, parsed.data.role, parsed.data.phone);
    return res.json({ success: true, role: user.role, phone: user.phone });
  } catch (err) {
    console.error("Set role error:", err);
    return res.status(500).json({ error: "Failed to set role" });
  }
});

// Get current user profile
profileRouter.get("/me", async (req, res) => {
  try {
    const userId = req.user!.id;
    const result = await getUserWithProfile(userId);

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(result);
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: "Failed to get profile" });
  }
});

// Create farmer profile (onboarding)
profileRouter.post("/farmer", async (req, res) => {
  try {
    const parsed = createFarmerProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const userId = req.user!.id;

    const userRole = await getUserRole(userId);
    if (userRole !== "FARMER") {
      return res.status(403).json({ error: "Only farmers can create farmer profile" });
    }

    // Check if profile already exists
    const existing = await getFarmerProfile(userId);
    if (existing) {
      return res.status(409).json({ error: "Farmer profile already exists" });
    }

    const profile = await createFarmerProfile(userId, parsed.data);
    return res.status(201).json({ success: true, profile });
  } catch (err) {
    console.error("Create farmer profile error:", err);
    return res.status(500).json({ error: "Failed to create farmer profile" });
  }
});

// Update farmer profile
profileRouter.patch("/farmer", async (req, res) => {
  try {
    const parsed = updateFarmerProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const userId = req.user!.id;
    const profile = await updateFarmerProfile(userId, parsed.data);
    return res.json({ success: true, profile });
  } catch (err) {
    console.error("Update farmer profile error:", err);
    return res.status(500).json({ error: "Failed to update farmer profile" });
  }
});
