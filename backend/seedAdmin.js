/*
 * Script pour créer un utilisateur admin dans la base de données
 */
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: "ecommerce",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected for seeding"));

// Création de l'utilisateur admin
const seedAdmin = async () => {
  try {
    // Supprimez l'utilisateur admin existant pour éviter les doublons
    await User.deleteOne({ email: "admin@example.com" });

    const admin = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    await admin.save();
    console.log("🎊🎉 Utilisateur admin créé avec succès");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'admin:", error);
    mongoose.connection.close();
  }
};

seedAdmin();
