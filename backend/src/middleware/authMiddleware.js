const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  // 1. Check karein ke Header mein Token hai ya nahi?
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Token nikaalein (Bearer token_string)
      token = req.headers.authorization.split(" ")[1];

      // 2. Token ko verify karein
      const decoded = jwt.verify(token, "mysecretkey123");

      // 3. User ka data nikaalein (password ke baghair) aur request mein save kar dein
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Agle step (Controller) par jao
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
