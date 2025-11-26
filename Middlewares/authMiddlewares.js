import { clerkClient } from "@clerk/clerk-sdk-node";

export const authenticateToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];

    // Verify Clerk session
    const session = await clerkClient.sessions.verifySession(token);

    if (!session || !session.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.auth = { userId: session.userId };
    next();
  } catch (err) {
    console.error("Clerk Auth Error:", err);
    return res.status(401).json({ message: "Unauthenticated" });
  }
};
