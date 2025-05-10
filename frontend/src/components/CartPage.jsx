/*
 * Page du panier avec gestion des articles et passage à la caisse
 */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  // Récupération du panier depuis l'API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("/cart");
        dispatch({ type: "SET_CART", payload: response.data });
      } catch (error) {
        console.error("Erreur lors de la récupération du panier:", error);
      }
    };
    fetchCart();
  }, [dispatch]);

  // Mise à jour de la quantité d'un article
  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await axios.post("/cart", { productId, quantity });
      dispatch({ type: "SET_CART", payload: response.data });
    } catch (error) {
      alert(
        error.response?.data?.error || "Erreur lors de la mise à jour du panier"
      );
    }
  };

  // Suppression d'un article du panier
  const removeItem = async (productId) => {
    try {
      const response = await axios.delete(`/cart/${productId}`);
      dispatch({ type: "SET_CART", payload: response.data });
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Erreur lors de la suppression de l'article"
      );
    }
  };

  // Calcul du total du panier
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Panier</h2>
      {items.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center border p-4 rounded"
              >
                <img
                  src={item.product.image || "https://via.placeholder.com/100"}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600">
                    ${item.product.price} x {item.quantity}
                  </p>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.product._id, parseInt(e.target.value))
                    }
                    className="w-16 border p-1 rounded mt-2"
                  />
                </div>
                <button
                  onClick={() => removeItem(item.product._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Passer à la caisse
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
