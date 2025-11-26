import express from "express";
import { 
  getAllBlogs, 
  getBlogBySlug, 
  createBlog, 
  updateBlog, 
  deleteBlog 
} from "../Controllers/blogControllers.js";

import { authenticateToken } from "../Middlewares/authMiddlewares.js";
import { uploadImage } from "../Controllers/imageControllers.js";
import uploadMiddleware from "../Middlewares/uploadMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllBlogs);

// PROTECTED ROUTES
router.post("/", authenticateToken, uploadMiddleware.single("image"), createBlog);
router.post("/upload", authenticateToken, uploadMiddleware.single("image"), uploadImage);
router.put("/:id", authenticateToken, uploadMiddleware.single("image"), updateBlog);
router.delete("/:id", authenticateToken, deleteBlog);

// MUST BE LAST
router.get("/:slug", getBlogBySlug);

export default router;
