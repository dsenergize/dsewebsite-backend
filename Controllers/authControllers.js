// Controllers/authControllers.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Models/userModels.js";


// -------------------------
// REGISTER
// -------------------------
export const register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  User.findOne({ email })
    .then((existing) => {
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      if (!hashedPassword) return;

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      return newUser.save();
    })
    .then((savedUser) => {
      if (!savedUser) return;

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
        },
      });
    })
    .catch((err) => {
      console.error("Register error:", err);
      res.status(500).json({ message: "Server error" });
    });
};



// -------------------------
// LOGIN
// -------------------------
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      return bcrypt.compare(password, user.password).then((isMatch) => ({
        user,
        isMatch,
      }));
    })
    .then((data) => {
      if (!data || !data.isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: data.user._id, email: data.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: data.user._id,
          email: data.user.email,
          name: data.user.name,
        },
      });
    })
    .catch((err) => {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    });
};



// -------------------------
// VERIFY TOKEN
// -------------------------
export const verifyToken = (req, res) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or invalid" });
  }

  const token = header.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  User.findById(decoded.userId)
    .select("-password")
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        message: "Token valid",
        user,
      });
    })
    .catch((err) => {
      console.error("Verify token error:", err);
      res.status(500).json({ message: "Server error" });
    });
};
