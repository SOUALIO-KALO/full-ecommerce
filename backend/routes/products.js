// routes/products.js
const express = require("express");
const router = express.Router();
const { query, body, validationResult } = require("express-validator");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// Validation pour la création/mise à jour de produit
const productValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer"),
];

// Route pour récupérer tous les produits avec filtres
router.get(
  "/",
  [query("category").optional().trim(), query("search").optional().trim()],
  async (req, res) => {
    try {
      const { category, search } = req.query;
      let query = {};

      if (category) query.category = category;
      if (search) query.name = { $regex: search, $options: "i" };

      const products = await Product.find(query).select("-__v");
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Route pour créer un produit (admin uniquement)
router.post("/", auth(["admin"]), productValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour mettre à jour un produit (admin uniquement)
router.put("/:id", auth(["admin"]), productValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour supprimer un produit (admin uniquement)
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
