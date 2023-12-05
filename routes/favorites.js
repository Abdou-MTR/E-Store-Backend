const express = require("express");
const router = express.Router();
const auth = require("./auth"); // You need to implement authentication middleware
const { User } = require("../modules/user");

// Endpoint to add a product to the user's favorites
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user information in the request object after authentication
    const productId = req.body.productId; // Assuming the product ID is sent in the request body

    // Check if the product is already in the favorites
    const user = await User.findById(userId);
    const isProductInFavorites = user.favorites.some(
      (item) => item.productId.toString() === productId
    );

    if (isProductInFavorites) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    // Add the product to the favorites
    user.favorites.push({ productId });
    await user.save();

    res
      .status(200)
      .json({ message: "Product added to favorites successfully" });
  } catch (error) {
    console.error("Error adding product to favorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
