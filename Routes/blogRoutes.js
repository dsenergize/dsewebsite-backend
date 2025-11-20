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

// DELETE & UPDATE must come BEFORE slug route
router.delete("/:id", authenticateToken, deleteBlog);
router.put("/:id", authenticateToken, uploadMiddleware.single("image"), updateBlog);

// GET all
router.get("/", getAllBlogs);

// upload
router.post("/upload", authenticateToken, uploadMiddleware.single("image"), uploadImage);

// create
router.post("/", authenticateToken, uploadMiddleware.single("image"), createBlog);

// GET by slug (this must remain last)
router.get("/:slug", getBlogBySlug);

export default router;
