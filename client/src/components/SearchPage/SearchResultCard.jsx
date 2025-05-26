import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import AddToCartButton from '../ProductPage/AddToCartButton';
import ProductCardButton from '../ui/ProductCardButton';

const SearchResultCard = ({ product }) => {


  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full z-10">
      {/* Product Link: Clickable Product Info */}
      <Link to={`/product/${product.id}`} className="flex flex-row">
        {/* Product Image */}
        <div className="relative w-40 h-40 mr-4 flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
          {product.originalPrice > product.price && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-tl-md">
              Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Top Section: Title & Rating */}
          <div>
            <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>

            <div className="flex items-center mt-1 text-sm text-gray-700">
              <FaStar className="text-yellow-400 mr-1" />
              <span>{product.rating} ({product.numReviews} reviews)</span>
            </div>

            <p className="text-gray-500 text-sm mt-1">Category: {product.category}</p>
          </div>

          {/* Price Section */}
          <div className="mt-2">
            <div className="flex items-baseline">
              <p className="text-green-600 font-bold text-xl">
                ${product.price.toFixed(2)}
              </p>
              {product.originalPrice > product.price && (
                <p className="text-gray-500 line-through ml-2">${product.originalPrice.toFixed(2)}</p>
              )}
            </div>
          </div>

          {/* Detail Info Block */}
          <div className="text-sm mt-3 space-y-1">
            <p className="text-green-700 font-semibold">In Stock</p>
            <p className="text-gray-700">Free Shipping on orders over $35</p>
            <p className="text-gray-700">
              Ships from <span className="font-medium">NewList Warehouse</span>, sold by <span className="font-medium">NewList</span>
            </p>
            <p className="text-gray-700">
              Delivery by <span className="font-medium">Monday, Apr 22</span> — 
              <span className="text-red-600 font-semibold ml-1">Order within 4 hrs 23 mins</span>
            </p>
            <p className="text-gray-600">Return eligible within 30 days of receipt</p>
          </div>
        </div>
      </Link>

      {/* Action Button: Add to Cart (Outside Link) */}
      <div className="mt-4 w-full">
    
          <ProductCardButton product={product} />
      </div>
    </div>
  );
};

export default SearchResultCard;
