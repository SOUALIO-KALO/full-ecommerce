// models/Order.js
const mongoose = require("mongoose");

// Schéma commande avec validation
const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
      },
    },
  ],
  total: {
    type: Number,
    required: [true, "Total is required"],
    min: [0, "Total cannot be negative"],
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "processing", "shipped", "delivered"],
      message: "{VALUE} is not a valid status",
    },
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
