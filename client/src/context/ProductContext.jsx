// src/context/ProductContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from '../config';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${config.BASE_URL}/api/products`),
          axios.get(`${config.BASE_URL}/api/categories`)
        ]);

        const productData = productsRes.data;
        const categoryData = categoriesRes.data;
        // Assign category images based on product variant or main product image
        const updatedCategories = categoryData.map((category) => {
          const productsInCategory = productData.filter(
            (product) => product.categ_id?.[0] === category.id
          );

          // Try to use a product variant image or fallback to product image
          let categoryImage = '/Images/product.webp';

          if (productsInCategory.length > 0) {
            const firstProduct = productsInCategory[0];

            const firstVariantImage =
              firstProduct.variants?.[0]?.image || null;

            const productImage = firstProduct.image || null;

            categoryImage = firstVariantImage || productImage || categoryImage;
          }

          return {
            ...category,
            image: categoryImage
          };
        });

        setProducts(productData);
        setCategories(updatedCategories);
      } catch (error) {
        console.error('Error fetching data from backend:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ProductContext.Provider value={{ products, categories, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
