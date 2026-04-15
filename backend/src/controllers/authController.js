const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ── REGISTER NEW USER ──
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check karein ke user pehle se toh nahi hai?
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Password ko "Hash" (lock) karein
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. User create karein
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        message: "User Registered Successfully!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check karein ke user database mein hai?
    const user = await User.findOne({ email });

    // 2. Agar user mil gaya, toh password match karein
    // user.password (hashed) ko req.body.password (plain) se compare karein
    if (user && (await bcrypt.compare(password, user.password))) {
      // 3. Agar sahi hai, toh JWT Token generate karein
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "mysecretkey123", // Secret key jo sirf server ko pata ho
        { expiresIn: "30d" }, // Token 30 din tak chale
      );

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token, // Yeh hai user ka "Identity Card"
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
