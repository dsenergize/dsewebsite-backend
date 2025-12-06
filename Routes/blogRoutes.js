import express from "express";
import {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../Controllers/blogControllers.js";
import upload from "../Middlewares/uploadMiddleware.js";
// 💡 IMPORTANT: Renamed the import to match the new, fixed function name (requireAuth)
// In blogRoutes.js
import { requireAuth } from "../Middlewares/authMiddlewares.js"; // This must match the export
const router = express.Router();

// Public Routes (no authentication required)
router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);

// Protected Routes (authentication and file upload required)

// POST /api/blogs
router.post(
  "/",
  requireAuth, // Use the new function name
  upload.single("imageFile"),
  createBlog
);
// ... and update all other protected routes

// PUT /api/blogs/:id
router.put(
  "/:id",
  // ✅ FIX: Using the new networkless authentication middleware
  requireAuth, 
  upload.single("imageFile"),
  updateBlog
);

// DELETE /api/blogs/:id
router.delete("/:id", 
  // ✅ FIX: Using the new networkless authentication middleware
  requireAuth, 
  deleteBlog
); 

export default router;