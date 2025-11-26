import express from "express";
import { uploadImage } from "../Controllers/imageControllers.js";
import upload from "../Middlewares/uploadMiddleware.js";
// NOTE: We generally make this route public so rich-text editor can upload images
// before the final blog post is authenticated/saved. If you want to protect it,
// you would add the authenticateToken middleware here.

const router = express.Router();

// POST /api/images - Handles image file upload to ImageKit
router.post(
  "/",
  upload.single("imageFile"), // Middleware to handle the file upload
  uploadImage
);

export default router;