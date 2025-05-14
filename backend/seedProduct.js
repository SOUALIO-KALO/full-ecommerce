/*
 * Script pour insérer 100 produits variés dans la base de données MongoDB
 */
const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: "ecommerce",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected for seeding"));

// Données de base pour générer des produits
const categories = ["electronics", "clothing", "home", "sports", "books"];
const adjectives = [
  "Smart",
  "Modern",
  "Classic",
  "Portable",
  "Premium",
  "Stylish",
  "Compact",
  "Durable",
];
const nouns = [
  "Phone",
  "Laptop",
  "Shirt",
  "Jacket",
  "Lamp",
  "Chair",
  "Ball",
  "Book",
  "Headphones",
  "Watch",
  "Speaker",
  "Tablet",
  "Jeans",
  "Sofa",
  "Racket",
  "Notebook",
];

// Fonction pour générer un nombre aléatoire dans une plage
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Fonction pour générer un produit
const generateProduct = (index) => ({
  name: `${adjectives[getRandomInt(0, adjectives.length - 1)]} ${
    nouns[getRandomInt(0, nouns.length - 1)]
  } ${index + 1}`,
  description: `High-quality ${adjectives[
    getRandomInt(0, adjectives.length - 1)
  ].toLowerCase()} product designed for ${
    categories[getRandomInt(0, categories.length - 1)]
  }. Perfect for everyday use.`,
  price: parseFloat(
    (getRandomInt(10, 1000) + getRandomInt(0, 99) / 100).toFixed(2)
  ),
  category: categories[getRandomInt(0, categories.length - 1)],
  stock: getRandomInt(0, 100),
  image: `https://via.placeholder.com/150?text=Product${index + 1}`,
});

// Génération de 100 produits
const products = Array.from({ length: 100 }, (_, index) =>
  generateProduct(index)
);

// Insertion des produits
const seedProducts = async () => {
  try {
    // Supprime les produits existants
    await Product.deleteMany();
    console.log("Produits existants supprimés");

    // Insère les nouveaux produits
    await Product.insertMany(products);
    console.log("👌 100 produits insérés avec succès");

    // Ferme la connexion
    mongoose.connection.close();
  } catch (error) {
    console.error("Erreur lors de l'insertion des produits:", error);
    mongoose.connection.close();
  }
};

// Exécute le seeding
seedProducts();
