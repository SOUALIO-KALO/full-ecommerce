/*
 * Page pour les administrateurs permettant d'ajouter ou de modifier un produit
 */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AdminAddProductPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null); // ID du produit en cours de modification

  // Vérifier si l'utilisateur est admin
  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  // Liste des catégories alignées avec HomePage.jsx
  const categories = ["electronics", "clothing", "home", "sports", "books"];

  // Vérifier si un produit est passé pour modification
  useEffect(() => {
    const product = location.state?.product;
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        image: product.image || "",
      });
      setEditingProductId(product._id);
    }
  }, [location.state]);

  // Gestion de la soumission du formulaire (ajout ou modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (editingProductId) {
        // Mise à jour du produit
        const response = await axios.put(
          `/products/${editingProductId}`,
          formData
        );
        console.log("Réponse API PUT /api/products/:id:", response.data); // Débogage
        setSuccess("Produit mis à jour avec succès !");
      } else {
        // Ajout d'un nouveau produit
        const response = await axios.post("/products", formData);
        console.log("Réponse API POST /api/products:", response.data); // Débogage
        setSuccess("Produit ajouté avec succès !");
      }
      // Réinitialiser le formulaire
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
      });
      setEditingProductId(null);
      setTimeout(() => navigate("/"), 2000); // Rediriger vers la page d'accueil après 2 secondes
    } catch (error) {
      console.error("Erreur lors de l'action sur le produit:", error);
      console.error("Détails de l'erreur:", error.response?.data); // Débogage
      setError(
        error.response?.data?.error || editingProductId
          ? "Erreur lors de la mise à jour du produit"
          : "Erreur lors de l'ajout du produit"
      );
    }
  };

  // Annuler la modification
  const handleCancelEdit = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: "",
    });
    setEditingProductId(null);
    setError(null);
    setSuccess(null);
    navigate("/admin/add-product"); // Réinitialiser la page
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">
        {editingProductId ? "Modifier un produit" : "Ajouter un produit"}
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nom</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Prix</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Catégorie</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Stock</label>
          <input
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">URL de l'image</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            className="w-full border p-2 rounded"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {editingProductId
              ? "Mettre à jour le produit"
              : "Ajouter le produit"}
          </button>
          {editingProductId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminAddProductPage;
