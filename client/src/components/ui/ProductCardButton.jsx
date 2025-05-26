import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProductCardButton = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const hasVariants = !!product.is_variant_product;

  const handleClick = () => {
    if (hasVariants) {
      // Allow access to variant page even if not logged in
      navigate(`/product/${product.id}`);
      return;
    }

    // For non-variant products, check login before adding to cart
    if (!user) {
      navigate("/login");
      return;
    }

    const cartItem = {
      ...product,
      selectedAttributes: {},
      _id: product.product_variant_id?.[0] || product.id,
      list_price: product.lst_price || product.price || 0,
      image: product.image_url || product.image || "",
      quantity: 1,
    };

    addToCart(cartItem);
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
    >
      {hasVariants ? "View Options" : "Add to Cart"}
    </button>
  );
};

export default ProductCardButton;
