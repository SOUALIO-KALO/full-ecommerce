// middleware/errorHandler.js
// Middleware global de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Gestion des erreurs spécifiques
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: Object.values(err.errors).map((val) => val.message),
    });
  }

  if (err.name === "MongoError" && err.code === 11000) {
    return res.status(400).json({ error: "Duplicate key error" });
  }

  // Erreur générique
  res.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;
