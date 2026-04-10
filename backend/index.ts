import express from "express";
import cors from "cors";
import { auth } from "./src/lib/auth";
import { toNodeHandler } from "better-auth/node";
import { profileRouter } from "./src/modules/profile/profile.route";
import { uploadRouter } from "./src/modules/upload/upload.route";
import { listingRouter } from "./src/modules/listing/listing.route";
import { categoryRouter } from "./src/modules/category/category.route";

const app = express();

// Better Auth — handles its own body parsing
app.all("/api/auth/{*any}", toNodeHandler(auth));

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/categories", categoryRouter);

// Health check
app.get("/", (req, res) => {
  res.send("FarmBridge API Server");
});

app.listen(3000, () => {
  console.log("FarmBridge server is running on port 3000");
});
