const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./src/config/db");
const productRoutes = require("./src/routes/productRoutes");

const app = express();

// Middleware
// Humne CORS ko simple kar diya hai taake local aur production dono handle ho jayein
app.use(
  cors({
    origin: ["*"], // Ye automatically request bhejne wale URL ko allow kar dega
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use("/api/products", productRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running properly...");
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Vercel handles listen differently, but for local we need this:
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`Server running on: http://localhost:${PORT}`),
  );
}

module.exports = app;
