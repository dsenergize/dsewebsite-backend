import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./Configs/db.js";
import blogRoutes from "./Routes/blogRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import fs from "fs";

// Import Clerk middleware
import { authenticateToken } from "./Middlewares/authMiddlewares.js";

dotenv.config();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use environment port in production
const PORT = process.env.PORT || 5000;
console.log("Loaded PORT =", PORT);

// Connect to MongoDB
// NOTE: Make sure connectDB is correctly configured to use environment variables
// that are available when the Docker container runs.
connectDB();

// Create the Express app
const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4173"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Public auth routes (register/login can still exist if needed)
app.use("/api/auth", authRoutes);

// Protected image upload route (for rich text editor image uploads)
// Note: The /api/images route handles image uploads before being authenticated
// in the blogRoutes. This is an intentional design pattern for public image uploads
// that might be embedded in user content before final submission.

// Use the authenticateToken middleware on the blog routes
// to protect create/update/delete operations.
app.use("/api/blogs", blogRoutes);

// 404 Not Found Handler
app.use((req, res) => {
  return res.status(404).json({ message: "Route not found" });
});

// NEW: Global Error Handler - MUST be the last middleware added
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  
  // Handle Multer errors specifically (e.g., file size exceeded or file type not allowed)
  if (err.name === 'MulterError') {
    let errorMessage = `File upload failed: ${err.message}`;
    if (err.code === 'LIMIT_FILE_SIZE') {
      errorMessage = 'File size limit exceeded. Max size is 5MB.';
    } else if (err.message.includes('image files')) {
      errorMessage = 'Only JPEG, JPG, PNG, and WebP image files are allowed.';
    }
    return res.status(400).json({ message: errorMessage });
  }
  
  // Handle general errors
  // If a status code was already set by a previous middleware (like in a controller), use it. 
  // Otherwise, default to 500 Internal Server Error.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? 'Production Stack Trace Hidden' : err.stack, // Hide stack in production
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;