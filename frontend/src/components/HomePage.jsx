/*
 * Page principale affichant le catalogue de produits avec recherche et filtres
 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Liste des catégories alignées avec seedProducts.js
  const categories = [
    { value: "", label: "Toutes catégories" },
    { value: "electronics", label: "Électronique" },
    { value: "clothing", label: "Vêtements" },
    { value: "home", label: "Maison" },
    { value: "sports", label: "Sports" },
    { value: "books", label: "Livres" },
  ];

  // Récupération des produits avec filtres via l'API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/products", {
          params: { search, category },
        });
        console.log("Réponse API produits:", response.data); // Débogage
        setProducts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        setError(
          error.response?.data?.error ||
            "Erreur lors du chargement des produits"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category]);

  // Gestion de la suppression d'un produit
  const handleDelete = async (productId) => {
    console.log("handleDelete appelé avec productId:", productId); // Débogage
    if (!productId) {
      console.error("Erreur: productId est undefined dans handleDelete"); // Débogage
      setError("Erreur: ID du produit non défini");
      return;
    }
    setError(null); // Effacer toute erreur précédente
    console.log(`Envoi de DELETE /api/products/${productId}`); // Débogage
    try {
      const deleteResponse = await axios.delete(`/products/${productId}`);
      console.log("Réponse API DELETE /api/products/:id:", deleteResponse.data); // Débogage
      // Rafraîchir la liste des produits
      const updatedResponse = await axios.get("/products", {
        params: { search, category },
      });
      console.log(
        "Réponse API GET /api/products après suppression:",
        updatedResponse.data
      ); // Débogage
      const validProducts = Array.isArray(updatedResponse.data.products)
        ? updatedResponse.data.products.filter((product) => product._id)
        : [];
      setProducts(validProducts);
      setError(null); // Confirmer qu'aucune erreur n'est définie après succès
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      console.error("Détails de l'erreur:", error.response?.data); // Débogage
      setError(
        error.response?.data?.error ||
          "Erreur lors de la suppression du produit"
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="text-center">Chargement des produits...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
