import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import ProductDetails from './ProductDetails';
import ProductImages from './ProductImages';
import ProductRating from './ProductRating';
import AddToCartButton from './AddToCartButton';
import ProductDescription from './ProductDescription';
import SimilarProducts from './SimilarProducts';

const ProductPage = () => {
  const { id } = useParams();
  const { products = [], loading } = useProducts();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => setHasScrolled(true));
  }, []);

  if (!hasScrolled) return null;

  if (loading) {
    return <p className="p-4 text-center">Loading product…</p>;
  }

  const product = products.find(p => p.id === Number(id));
  if (!product) {
    return <div className="p-4 text-red-600">Product not found.</div>;
  }

  const allImages = [product.image, ...product.variants.map(v => v.image)].filter(Boolean);

  // Compose product object with selectedAttributes for cart
  const productWithSelectedAttributes = {
    ...product,
    selectedAttributes: selectedVariant
      ? selectedVariant.attributes.reduce((acc, attr) => {
          acc[attr.attribute_name] = attr.value_name;
          return acc;
        }, {})
      : {},
    id: product.id,
  };

  return (
    <div className="product-page">
      <div className="container flex flex-col md:flex-row p-4">
        <div className="flex-1 md:w-1/2 mb-4 md:mb-0">
          <ProductImages images={allImages} />
        </div>

        <div className="flex-1 md:w-1/2 pl-4">
          <ProductDetails
            product={product}
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelectVariant={setSelectedVariant}
          />
          <AddToCartButton product={productWithSelectedAttributes} variant={selectedVariant} />

        </div>
      </div>

      <ProductDescription description={product.description_sale || product.description} />
      <ProductRating rating={product.rating ?? 0} reviews={product.reviews || []} />
      <SimilarProducts category={product.category_name || product.category} />
    </div>
  );
};

export default ProductPage;
