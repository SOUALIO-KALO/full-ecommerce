/* src/components/Header.jsx
 * Composant d'en-tête avec navigation, gestion de la déconnexion et icône de panier
 */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  // Calcul du nombre total d'éléments dans le panier
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Gestion de la déconnexion
  const handleLogout = () => {
    dispatch({ type: "CLEAR_USER" });
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("token");
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          E-Shop
        </Link>
        <div className="flex space-x-4 items-center">
          <Link to="/products" className="hover:underline">
            Produits
          </Link>
          <Link to="/cart" className="relative hover:text-gray-300">
            <FaShoppingCart className="text-xl" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/orders" className="hover:underline">
                Commandes
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Connexion
              </Link>
              <Link to="/register" className="hover:underline">
                Inscription
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
