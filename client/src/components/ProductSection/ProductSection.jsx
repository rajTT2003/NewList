import React from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import AddToCartButton from '../ProductPage/AddToCartButton';
import ProductCardButton from '../ui/ProductCardButton';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const {
    id,
    name,
    price,
    originalPrice,
    rating,
    numReviews,
    image,
    is_variant_product,
    variants,
    product_variant_ids,
    category_name,
    description_sale,
    cost,
    qty_available,
    default_code,
    type,
    attributes,
  } = product;
  
  const renderStars = () =>
    [...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} />
    ));

  return (
    <div   className="bg-white shadow-lg rounded-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow p-4">

    
    <div
      onClick={() => navigate(`/product/${id}`)}
    
    >
      <img
        src={image}
        alt={name}
        className="w-full h-48 sm:h-60 md:h-72 object-cover bg-gray-200 p-1"
      />
      <div className="py-2">
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{name}</h3>
        <div className="flex items-center mt-2">
          {renderStars()}
          <span className="text-gray-500 text-sm ml-2">({numReviews} reviews)</span>
        </div>
        <div className="mt-2">
        <span className="text-xl font-semibold text-green-600">${price.toFixed(2)}</span>
        <span className="text-sm text-gray-500 line-through ml-2">${originalPrice.toFixed(2)}</span>

        </div>
       
      </div>
    </div>
      <ProductCardButton product={product}/>  
    </div>
  );
};

const ProductSection = () => {
  const { products,  loading } = useProducts();

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
       

        <h2 className="text-3xl font-semibold text-center mt-12 mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: product.list_price, // keep as number
                originalPrice: product.list_price * 1.2, // keep as number
                rating: 4 + Math.random(),
                numReviews: Math.floor(Math.random() * 1000),
                image: `data:image/png;base64,${product.image_1920}`,
              }}
            />

          
          
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
