import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../utils/axios";

const CartContext = createContext();
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

// Normalize selectedAttributes to object { attribute_name: value_name }
const normalizeSelectedAttributes = (selectedAttributes) => {
  if (Array.isArray(selectedAttributes)) {
    const obj = {};
    selectedAttributes.forEach(({ attribute_name, value_name }) => {
      obj[attribute_name] = value_name;
    });
    return obj;
  }
  if (typeof selectedAttributes === "object" && selectedAttributes !== null) {
    return selectedAttributes;
  }
  return {};
};

const generateCartItemKey = (product) => {
  const selAttrs = normalizeSelectedAttributes(product.selectedAttributes);
  return `${product.id}-${JSON.stringify(selAttrs)}`;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const { user, token } = useAuth();

  const saveCartToBackend = async (cart) => {
    try {
      const normalizedCart = cart
        .filter((item) => item.id)
        .map((item) => ({
          productId: Number(item.id),
          quantity: item.quantity,
          selectedAttributes: normalizeSelectedAttributes(item.selectedAttributes),
          productName: item.name, // <-- ADD THIS LINE
        }));


      console.log("Sending normalized cart:", normalizedCart);

      await api.post(
        "/api/cart/save-cart",
        { cart: normalizedCart },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Cart saved");
    } catch (err) {
      console.error("Failed to save cart:\n", err);
    }
  };

  const loadCartFromBackend = async () => {
    try {
      console.log("Loading cart with token:", token);
      const response = await api.get("/api/cart/get-cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const serverCart = response.data.cart || [];
      console.log("Server cart:", serverCart);

      // Normalize and reconstruct frontend cart shape
      const normalizedCart = serverCart.map((item) => {
        const selectedAttributes = normalizeSelectedAttributes(item.selectedAttributes);
        const id = item.productId?.toString() || item.id?.toString();
        const cartItemKey = generateCartItemKey({ id, selectedAttributes });

        return {
          ...item,
          id,
          selectedAttributes,
          cartItemKey,
        };
      });

      setCart(normalizedCart);
      setIsCartLoaded(true);
    } catch (err) {
      console.error("Failed to load cart:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (user && token) {
      console.log("User and token available, loading cart...");
      loadCartFromBackend();
    } else {
      console.log("User logged out or token missing, clearing cart.");
      setCart([]);
      setIsCartLoaded(false);
    }
  }, [user, token]);

  // Save cart after loading and whenever cart changes
  useEffect(() => {
    if (user && isCartLoaded) {
      saveCartToBackend(cart);
    }
  }, [cart, user, isCartLoaded]);

  const addToCart = (product) => {
    const productWithNormalizedAttrs = {
      ...product,
      selectedAttributes: normalizeSelectedAttributes(product.selectedAttributes),
    };

    if (!productWithNormalizedAttrs.id) {
      console.error("Product must have a unique id to add to cart");
      return;
    }

    const key = generateCartItemKey(productWithNormalizedAttrs);

    const existingProduct = cart.find((item) => item.cartItemKey === key);

    let updatedCart;
    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item.cartItemKey === key
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...productWithNormalizedAttrs, quantity: 1, cartItemKey: key }];
    }

    setCart(updatedCart);
  };

  const removeFromCart = (cartItemKey) => {
    setCart(cart.filter((item) => item.cartItemKey !== cartItemKey));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
