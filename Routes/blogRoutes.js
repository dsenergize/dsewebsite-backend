import express from "express";
import {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../Controllers/blogControllers.js";
import upload from "../Middlewares/uploadMiddleware.js";
import { authenticateToken } from "../Middlewares/authMiddlewares.js"; // Import Auth Middleware

const router = express.Router();

// Public Routes (no authentication required)
router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);

// Protected Routes (authentication and file upload required)
// POST /api/blogs
router.post(
  "/",
  authenticateToken, // 1. Check if user is authenticated
  upload.single("imageFile"), // 2. Handle single file upload with field name 'imageFile'
  createBlog
);

// PUT /api/blogs/:id
router.put(
  "/:id",
  authenticateToken, // 1. Check if user is authenticated
  upload.single("imageFile"), // 2. Handle single file upload
  updateBlog
);

// DELETE /api/blogs/:id
router.delete("/:id", authenticateToken, deleteBlog); // Auth only needed

export default router;