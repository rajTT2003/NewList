// routes/cart.js (your backend routes)
const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/auth");
const User = require("../models/User");
const { getProductById } = require("../odoo");

// Save cart to user document
router.post("/save-cart", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    let { cart } = req.body;

    if (!Array.isArray(cart)) {
      return res.status(400).json({ error: "Invalid cart format" });
    }

    // Normalize cart items - ensure selectedAttributes is an object (not array)
    cart = cart.map((item) => {
      let selectedAttributes = {};
      if (item.selectedAttributes) {
        if (Array.isArray(item.selectedAttributes)) {
          item.selectedAttributes.forEach(({ attribute_name, value_name }) => {
            selectedAttributes[attribute_name] = value_name;
          });
        } else if (typeof item.selectedAttributes === "object") {
          selectedAttributes = item.selectedAttributes;
        }
      }

      return {
        productId: Number(item.productId),
        quantity: Number(item.quantity) || 1,
        selectedAttributes,
        productName: item.productName || '', // <-- ADD THIS
      };
    });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.cart = cart;
    await user.save();

    res.json({ success: true, cart: user.cart });
  } catch (err) {
    console.error("Error saving cart:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get enriched cart with Odoo product details
router.get("/get-cart", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const enrichedCart = await Promise.all(
      user.cart.map(async (item) => {
        try {
          const product = await getProductById(item.productId);

          if (!product) {
            console.warn(`⚠️ Product with productId ${item.productId} not found in Odoo.`);
            return null;
          }

          const selectedAttributes = item.selectedAttributes || {};

          // Filter product attributes to include only those selected
          const filteredAttributes = product.attributes?.filter((attr) => {
            return selectedAttributes[attr.attribute_name] === attr.value_name;
          });

         return {
            id: product?.id || item.productId,
            name: product?.name || item.productName || "Unknown Product", // <--- USE SAVED NAME
            price: product?.price,
            image: product?.image,
            quantity: item.quantity,
            selectedAttributes,
            attributes: filteredAttributes || [],
            cartItemKey: `${item.productId}-${JSON.stringify(selectedAttributes)}`,
          };

        } catch (err) {
          console.warn(`⚠️ Failed to fetch product ${item.productId} from Odoo:`, err.message);
          return null;
        }
      })
    );

    const validCart = enrichedCart.filter(Boolean);

    if (validCart.length !== user.cart.length) {
      console.warn("Some cart items were invalid or missing.");
    }

    res.json({ cart: validCart });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ error: "Failed to fetch cart." });
  }
});

module.exports = router;
