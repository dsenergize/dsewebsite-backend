import express from "express";
import { registerUser, getAllUsers } from "../Controllers/authController.js";
import { authenticateToken } from "../Middlewares/authMiddleware.js";

const router = express.Router();

// Open route (no Clerk auth needed)
router.post("/register", registerUser);

// Protected route (requires Clerk auth)
router.get("/", authenticateToken, getAllUsers);

export default router;
