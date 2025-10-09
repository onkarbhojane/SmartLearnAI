import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate Access Token
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY}); // short-lived
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }); // long-lived
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email_id: email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Default PDF study material
    const defaultStudyMaterial = {
      title: "PHYSICS PART TEXTBOOK FOR CLASS XI",
      pdfUrl: "https://res.cloudinary.com/dsikrz9h8/image/upload/v1760031316/NCERT-Class-11-Physics-Part-1_jokdqv.pdf",
      RAG_id: "ncert-class-11-physics-part-1-1760033673675",
      description: "NCERT Physics Class XI Part 1 PDF",
    };

    // Create user with default study material
    const user = await User.create({
      name,
      email_id: email,
      password: hash,
      study_materials: [defaultStudyMaterial],
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      msg: "User registered",
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};


// Login User
export const loginUser = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email_id: email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      msg: "Login successful",
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
