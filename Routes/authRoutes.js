// Routes/authRoutes.js
import express from 'express';
import { login, register, verifyToken } from '../Controllers/authControllers.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify', verifyToken);

export default router;