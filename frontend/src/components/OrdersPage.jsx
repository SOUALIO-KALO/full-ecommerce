/* src/components/OrdersPage.jsx
 * Page affichant l'historique des commandes de l'utilisateur
 */
import React, { useState, useEffect } from "react";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  // Récupération des commandes via l'API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Mes commandes</h2>
      {orders.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded">
              <p className="font-bold">Commande #{order._id}</p>
              <p>Statut: {order.status}</p>
              <p>Total: ${order.total.toFixed(2)}</p>
              <div className="mt-2">
                <p className="font-semibold">Produits:</p>
                {order.products.map((item) => (
                  <p key={item.product._id}>
                    {item.product.name} x {item.quantity} - $
                    {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
