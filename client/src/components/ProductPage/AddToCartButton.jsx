import React from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddToCartButton = ({ product, variant }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdd = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const selectedAttributes = {};
    variant?.attributes?.forEach(attr => {
      selectedAttributes[attr.attribute_name] = attr.value_name;
    });

    const enrichedProduct = {
      ...product,
      selectedAttributes, // Object form
      list_price: variant?.price ?? product.list_price,
      image: variant?.image ?? product.image,
      id: variant?.id || product.id,  // Use `id` consistently
    };

    addToCart(enrichedProduct);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={!variant}
      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
