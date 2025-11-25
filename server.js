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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Public auth routes (register/login can still exist if needed)
app.use("/api/auth", authRoutes);

// Protected routes (example: blogs can require auth)
app.use("/api/blogs", authenticateToken, blogRoutes);

app.use((req, res) => {
  return res.status(404).json({ message: "Route not found" });
});

// ===================

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;