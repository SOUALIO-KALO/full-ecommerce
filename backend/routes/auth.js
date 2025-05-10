/* backend/routes/auth.js
 * Routes pour gérer l'authentification des utilisateurs
 */
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Validation pour l'inscription
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be user or admin"),
];

// Validation pour la connexion
const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Route pour l'inscription
router.post("/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      user: { id: user._id, name, email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour la connexion
router.post("/login", loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      user: { id: user._id, name: user.name, email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour récupérer les informations de l'utilisateur connecté
router.get("/me", auth(["user", "admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
