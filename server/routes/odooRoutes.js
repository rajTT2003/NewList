const express = require('express');
const passport = require('passport');
const { getProducts, createSaleOrder, getCategories } = require('../odoo');
const router = express.Router();


// Example API endpoint to fetch products from Inventory
router.get('/api/products', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error('Error in /api/products route:', error); 
    res.status(500).json({ error: 'Failed to fetch products from Inventory' });
  }
});
// In your routes/index.js or routes.js
router.get('/api/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories from Inventory' });
  }
});


// Example API endpoint to create a sale order in Sales
router.post('/api/sale-order', async (req, res) => {
  try {
    const orderData = req.body;
    const saleOrder = await createSaleOrder(orderData);
    res.json(saleOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sale order' });
  }
});

module.exports = router;
