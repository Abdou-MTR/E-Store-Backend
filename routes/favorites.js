const express = require("express");
const router = express.Router();
const { User } = require("../modules/user");

// Endpoint to add or remove a product from the user's favorites
router
  .route("/")
  .post(async (req, res) => {
    try {
      const email = req.body.email;
      const productId = req.body.productId;
      console.log(
        "Received request to add product with email:",
        email,
        "and productId:",
        productId
      );

      // Check if the product is already in the favorites
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isProductInFavorites = user.wishlist.some(
        (item) => item.productId.toString() === productId
      );

      if (isProductInFavorites) {
        return res
          .status(400)
          .json({ message: "Product already in favorites" });
      }

      // Add the product to the favorites
      user.wishlist.push({ productId });
      await user.save();

      res
        .status(200)
        .json({ message: "Product added to favorites successfully" });
    } catch (error) {
      console.error("Error adding product to favorites:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
  .delete(async (req, res) => {
    try {
      const email = req.body.email;
      const productId = req.body.productId;
      console.log(
        "Received request to remove product with email:",
        email,
        "and productId:",
        productId
      );

      // Find the user
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove the product from favorites
      user.wishlist = user.wishlist.filter(
        (item) => item.productId.toString() !== productId
      );

      await user.save();

      res
        .status(200)
        .json({ message: "Product removed from favorites successfully" });
    } catch (error) {
      console.error("Error removing product from favorites:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;
