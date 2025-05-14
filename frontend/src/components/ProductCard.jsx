/*
 * Composant pour afficher une carte produit avec options d'ajout au panier et de suppression (admin)
 */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const ProductCard = ({ product, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Ajout d'un produit au panier via une requête API
  const addToCart = async () => {
    try {
      const response = await axios.post("/cart", {
        productId: product._id,
        quantity: 1,
      });
      dispatch({ type: "SET_CART", payload: response.data });
      alert("Produit ajouté au panier !");
    } catch (error) {
      alert(error.response?.data?.error || "Erreur lors de l'ajout au panier");
    }
  };

  const handleDelete = () => {
    if (!product?._id) {
      console.error(
        "Erreur: product._id est undefined pour suppression",
        product
      ); // Débogage
      return;
    }
    console.log("Confirmation de suppression pour productId:", product._id); // Débogage
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    if (onDelete) {
      console.log(`Appel de onDelete pour le produit ID: ${product._id}`); // Débogage
      onDelete(product._id);
    }
  };

  // Vérifier si le produit est valide
  if (!product || !product.name || !product._id) {
    console.warn("Produit invalide détecté:", product); // Débogage
    return null;
  }

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.name}
        className="w-full h-48 object-contain  mb-2"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-xl font-bold mt-2">${product.price}</p>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={addToCart}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter au panier
        </button>
        {user && user.role === "admin" && (
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
