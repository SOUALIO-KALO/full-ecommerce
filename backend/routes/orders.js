// routes/orders.js
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Validation pour la création de commande
const orderValidation = [
  body("paymentMethodId")
    .notEmpty()
    .withMessage("Payment method ID is required"),
];

// Route pour créer une commande
router.post("/", auth(), orderValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user._id).populate("cart.product");
    if (!user.cart.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calcul du total
    const total = user.cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Création du payment intent avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Conversion en cents
      currency: "usd",
      payment_method: req.body.paymentMethodId,
      confirm: true,
      error_on_requires_action: true,
    });

    // Création de la commande
    const order = new Order({
      user: user._id,
      products: user.cart,
      total,
    });

    await order.save();

    // Vider le panier
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour récupérer les commandes de l'utilisateur
router.get("/", auth(), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product")
      .select("-__v");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
