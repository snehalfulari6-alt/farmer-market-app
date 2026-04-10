import { Router } from "express";
import { prisma } from "../../lib/prisma";

export const categoryRouter = Router();

categoryRouter.get("/", async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return res.json({ success: true, categories });
  } catch (err) {
    console.error("List categories error:", err);
    return res.status(500).json({ error: "Failed to list categories" });
  }
});
