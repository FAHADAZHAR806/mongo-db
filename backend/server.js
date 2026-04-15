const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./src/config/db");
const productRoutes = require("./src/routes/productRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Sub ko allow kar dein taake CORS error na aaye
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Root route (Railway health check ke liye)
app.get("/", (req, res) => {
  res.send("API is running properly on Railway!");
});

// Port configuration
const PORT = process.env.PORT || 5000;

// FIX: Listen ko hamesha chalna chahiye Railway par
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port: ${PORT}`);
});

module.exports = app;
