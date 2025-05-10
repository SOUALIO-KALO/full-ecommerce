/* src/components/ProductCard.jsx
 * Composant pour afficher une carte produit avec option d'ajout au panier
 */
import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  // Ajout d'un produit au panier via une requête API
  const addToCart = async () => {
    try {
      const response = await axios.post("/cart", {
        productId: product._id,
        quantity: 1,
      });
      dispatch({ type: "SET_CART", payload: response.data });
    } catch (error) {
      alert(error.response?.data?.error || "Erreur lors de l'ajout au panier");
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.name}
        className="w-full h-48 object-cover mb-2"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-xl font-bold mt-2">${product.price}</p>
      <button
        onClick={addToCart}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ajouter au panier
      </button>
    </div>
  );
};

export default ProductCard;
