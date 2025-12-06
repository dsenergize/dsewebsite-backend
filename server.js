// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./Configs/db.js";
import blogRoutes from "./Routes/blogRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import fs from "fs";

// ✅ FIX: The exported function name was changed to 'requireAuth'
import { requireAuth } from "./Middlewares/authMiddlewares.js";

dotenv.config();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CLOUD RUN PORT CONFIGURATION ---
// Use the environment port provided by Cloud Run, or default to 5000 for local development.
const PORT = process.env.PORT || 5000;
console.log(`Server will run on port: ${PORT} (using process.env.PORT)`);

// Connect to MongoDB
// NOTE: Make sure connectDB is configured to use process.env.MONGO_URI
connectDB();

// Create the Express app
const app = express();

// Middleware
// --- MODIFIED CORS CONFIGURATION FOR ALL ORIGINS ---
app.use(
  cors({
    origin: "*", // The wildcard character allows all origins (e.g., all domains)
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Public auth routes 
app.use("/api/auth", authRoutes);

// Use the blog routes
// NOTE: We don't apply the auth middleware here in server.js, 
// as it is correctly applied directly within blogRoutes.js (POST, PUT, DELETE).
app.use("/api/blogs", blogRoutes); 

// 404 Not Found Handler
app.use((req, res) => {
  return res.status(404).json({ message: "Route not found" });
});

// Global Error Handler - MUST be the last middleware added
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  
  // Handle Multer errors specifically (for file uploads)
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
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
  res.status(statusCode).json({
    message: err.message,
    // Hide internal stack trace in production for security
    stack: process.env.NODE_ENV === 'production' ? 'Production Stack Trace Hidden' : err.stack,
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running and listening on port ${PORT}`));

export default app;