// Middlewares/authMiddleware.js (Clerk Version)
// Make sure CLERK_SECRET_KEY is available in your backend environment variables!
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const authenticateToken = (req, res, next) => {
  // ClerkExpressRequireAuth verifies the token against Clerk's public key
  // and adds authentication information to req.auth (if successful).
  ClerkExpressRequireAuth()(req, res, next);
};