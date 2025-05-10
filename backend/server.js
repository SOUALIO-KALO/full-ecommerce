// server.js
// Importation des dépendances nécessaires
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/db");

// Chargement des variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();

// Configuration des middlewares
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // Sécurisation CORS
app.use(morgan("dev")); // Logging des requêtes HTTP
app.use(express.json({ limit: "10kb" })); // Parsing JSON avec limite de taille

// Définition des routes principales
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));

// Middleware de gestion des erreurs (doit être après les routes)
app.use(errorHandler);

// Initialisation de la connexion à la base de données
connectDB();

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
