import { clerkClient } from "@clerk/clerk-sdk-node";

export const requireAuth = (req, res, next) => {
  return clerkClient.expressRequireAuth({
    onError: (err) => {
      console.error("Clerk Auth Error:", err.message);
      return res.status(401).json({ message: "Unauthenticated" });
    }
  })(req, res, next);
};