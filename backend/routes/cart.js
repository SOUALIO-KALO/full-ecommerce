// routes/cart.js
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Product = require("../models/Product");

// Validation pour l'ajout au panier
const cartValidation = [
  body("productId").isMongoId().withMessage("Valid product ID is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

// Route pour récupérer le panier
router.get("/", auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("cart.product")
      .select("cart -_id");
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour ajouter/modifier un article dans le panier
router.post("/", auth(), cartValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);

    // Vérification si le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Mise à jour du panier
    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    await user.populate("cart.product");
    res.json(user.cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour supprimer un article du panier
router.delete("/:productId", auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    await user.save();
    await user.populate("cart.product");
    res.json(user.cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
