import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../../lib/require-auth";
import { uploadImageToCloudinary } from "../../lib/cloudinary";

export const uploadRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

uploadRouter.use(requireAuth);

uploadRouter.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const result = await uploadImageToCloudinary(req.file.buffer, "farmbridge");

    return res.status(201).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Failed to upload image" });
  }
});
