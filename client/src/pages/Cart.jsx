import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.list_price) * item.quantity,
    0
  );

  // 🔒 If not logged in, show lock screen
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Sign in to View Your Cart</h2>
        <p className="text-gray-600 mb-6">Your shopping cart is only accessible after signing in.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded text-lg"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Section */}
      <div className="md:col-span-2">
        <h2 className="text-3xl font-semibold border-b pb-4 mb-4">Shopping Cart</h2>
        {cart.length === 0 ? (
          <p className="text-lg text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.cartItemKey} className="flex gap-4 border-b pb-4">
                <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Price: <span className="text-black font-medium">${item.list_price}</span></p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>

                  {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                    <div className="text-sm text-gray-500">
                      {Object.entries(item.selectedAttributes).map(([key, val]) => (
                        <div key={key}>{key}: {val}</div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => removeFromCart(item.cartItemKey)}
                    className="mt-2 text-blue-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Section */}
      {cart.length > 0 && (
        <div className="bg-gray-100 p-6 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Items ({cart.length}):</span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Shipping:</span>
            <span className="text-green-600">FREE</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>
          <button className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded">
            Proceed to Checkout
          </button>
          <button
            onClick={clearCart}
            className="w-full mt-2 text-sm text-red-500 hover:underline"
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
