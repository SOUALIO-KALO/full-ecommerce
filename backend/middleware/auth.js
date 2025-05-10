// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware d'authentification avec rôles
const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      // Vérification de la présence du token
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Vérification et décodage du token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Recherche de l'utilisateur
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error("User not found");
      }

      // Vérification des rôles
      if (roles.length && !roles.includes(user.role)) {
        throw new Error("Access denied: insufficient permissions");
      }

      // Ajout de l'utilisateur à la requête
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };
};

module.exports = auth;
