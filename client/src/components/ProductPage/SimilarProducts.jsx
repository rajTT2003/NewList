import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Star } from 'lucide-react'; // Optional icon, replace with any star icon

const SimilarProducts = ({ category }) => {
  const similarProducts = [
    { 
      id: 1, 
      name: 'Wireless Headphones', 
      price: 99.99, 
      originalPrice: 129.99, 
      rating: 4.5, 
      image: '/Images/laptop.jpeg',
      description: 'High-quality sound with deep bass and noise cancellation.',
    },
    { 
      id: 2, 
      name: 'Smart Speaker', 
      price: 79.99, 
      originalPrice: 99.99, 
      rating: 4.2, 
      image: '/Images/laptop.jpeg',
      description: 'Voice assistant with rich sound and smart home integration.',
    },
    { 
      id: 3, 
      name: 'Bluetooth Mouse', 
      price: 29.99, 
      originalPrice: 39.99, 
      rating: 4.0, 
      image: '/Images/laptop.jpeg',
      description: 'Ergonomic design with smooth Bluetooth connectivity.',
    },
    { 
      id: 4, 
      name: 'USB-C Hub', 
      price: 49.99, 
      originalPrice: 59.99, 
      rating: 4.3, 
      image: '/Images/laptop.jpeg',
      description: 'Expand your connectivity with multiple USB ports and HDMI.',
    },
    { 
      id: 5, 
      name: 'Webcam', 
      price: 59.99, 
      originalPrice: 69.99, 
      rating: 4.1, 
      image: '/Images/laptop.jpeg',
      description: '1080p webcam with auto-focus and low-light correction.',
    },
  ];

  return (
    <div className="similar-products mt-12 px-4">
      <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {similarProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl p-4 shadow hover:shadow-lg transition duration-300 cursor-pointer group"
          >
            <Link to={`/product/${product.id}`} className="block">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-contain mb-3 group-hover:opacity-80 transition duration-200"
              />
              
              <h3 className="text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-2">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center text-yellow-500 text-xs mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                    strokeWidth={1}
                    className="mr-0.5"
                  />
                ))}
                <span className="ml-1 text-gray-500">({product.rating})</span>
              </div>

              {/* Price */}
              <div className="mt-2">
                <p className="text-lg font-semibold text-red-600">${product.price.toFixed(2)}</p>
                {product.originalPrice && (
                  <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 mt-2 line-clamp-2">{product.description}</p>
            </Link>

            {/* Add to Cart Button */}
            <button className="mt-4 w-full py-2 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
