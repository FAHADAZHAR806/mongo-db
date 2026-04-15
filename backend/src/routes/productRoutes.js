const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware"); // Middleware import karein

// ── ROUTES ──

// Saare products lene ke liye
router.get("/", productController.getProducts);

// FIX: Specific product lene ke liye (Iske baghair View/Edit nahi chalega)
router.get("/:id", productController.getProductById);

// Naya product banane ke liye
router.post("/", protect, productController.createProduct);

// Update karne ke liye
router.put("/:id", protect, productController.updateProduct);

// Delete karne ke liye
router.delete("/:id", protect, productController.deleteProduct);

module.exports = router;
