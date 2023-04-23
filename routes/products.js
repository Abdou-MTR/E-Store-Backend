// routes.js

const express = require("express");
const router = express.Router();
const Product = require("../modules/product");
const upload = require("../middleware/upload");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Create new product object from request body and uploaded image filename
    const product = new Product({
      name: req.body.name,
      miniDescription: req.body.miniDescription,
      category: req.body.category,
      rating: req.body.rating,
      price: req.body.price,
      brand: req.body.brand,
      weight: req.body.weight,
      size: req.body.size,
      dimensions: req.body.dimensions,
      shippingFees: req.body.shippingFees,
      description: req.body.description,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });
    // Save product to database
    await product.save();
    // Send success response
    res.status(201).json({ success: true });
  } catch (err) {
    // If there was an error, delete uploaded image and send error response
    fs.unlinkSync(`public/uploads/${req.file.filename}`);
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
