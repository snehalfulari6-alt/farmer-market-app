import { Router } from "express";
import { requireAuth } from "../../lib/require-auth";
import {
  createListingSchema,
  listListingQuerySchema,
  updateListingSchema,
} from "./listing.schema";
import {
  createListing,
  getFarmerProfileIdByUserId,
  getListingById,
  listListings,
  softDeleteListing,
  updateListing,
} from "./listing.service";

export const listingRouter = Router();

listingRouter.use(requireAuth);

listingRouter.post("/", async (req, res) => {
  try {
    const parsed = createListingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const farmerProfileId = await getFarmerProfileIdByUserId(req.user!.id);
    if (!farmerProfileId) {
      return res.status(403).json({ error: "Farmer profile not found" });
    }

    const listing = await createListing(farmerProfileId, parsed.data);
    return res.status(201).json({ success: true, listing });
  } catch (err) {
    console.error("Create listing error:", err);
    return res.status(500).json({ error: "Failed to create listing" });
  }
});

listingRouter.get("/", async (req, res) => {
  try {
    const parsed = listListingQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const farmerProfileId = await getFarmerProfileIdByUserId(req.user!.id);
    if (!farmerProfileId) {
      return res.status(403).json({ error: "Farmer profile not found" });
    }

    const listings = await listListings(farmerProfileId, parsed.data);
    return res.json({ success: true, listings });
  } catch (err) {
    console.error("List listing error:", err);
    return res.status(500).json({ error: "Failed to list listings" });
  }
});

listingRouter.get("/:id", async (req, res) => {
  try {
    const farmerProfileId = await getFarmerProfileIdByUserId(req.user!.id);
    if (!farmerProfileId) {
      return res.status(403).json({ error: "Farmer profile not found" });
    }

    const listing = await getListingById(farmerProfileId, req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    return res.json({ success: true, listing });
  } catch (err) {
    console.error("Get listing error:", err);
    return res.status(500).json({ error: "Failed to get listing" });
  }
});

listingRouter.patch("/:id", async (req, res) => {
  try {
    const parsed = updateListingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const farmerProfileId = await getFarmerProfileIdByUserId(req.user!.id);
    if (!farmerProfileId) {
      return res.status(403).json({ error: "Farmer profile not found" });
    }

    const listing = await updateListing(
      farmerProfileId,
      req.params.id,
      parsed.data,
    );
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    return res.json({ success: true, listing });
  } catch (err) {
    console.error("Update listing error:", err);
    return res.status(500).json({ error: "Failed to update listing" });
  }
});

listingRouter.delete("/:id", async (req, res) => {
  try {
    const farmerProfileId = await getFarmerProfileIdByUserId(req.user!.id);
    if (!farmerProfileId) {
      return res.status(403).json({ error: "Farmer profile not found" });
    }

    const listing = await softDeleteListing(farmerProfileId, req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Delete listing error:", err);
    return res.status(500).json({ error: "Failed to delete listing" });
  }
});
