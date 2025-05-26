import React, { useState, useEffect } from 'react';

const ProductDetails = ({ product, variants = [], selectedVariant, onSelectVariant }) => {
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentPrice, setCurrentPrice] = useState(0);

  // Set default selected variant and attributes on load
useEffect(() => {
  if (variants.length > 0) {
    const defaultAttributes = {};
    variants[0].attributes.forEach((attr) => {
      defaultAttributes[attr.attribute_name] = attr.value_name;
    });
    setSelectedAttributes(defaultAttributes);
    const basePrice = variants[0].price ?? product.list_price ?? 0;
    const extraPrice = variants[0].attributes.reduce((acc, attr) => acc + (attr.price_extra ?? 0), 0);
    setCurrentPrice(basePrice + extraPrice);
    onSelectVariant(variants[0]);
  }
}, [variants, product]);


  // Calculate the active variant based on selected attributes
  const activeVariant = variants.find((variant) =>
    Object.keys(selectedAttributes).every(attr =>
      variant.attributes.some(a => a.attribute_name === attr && a.value_name === selectedAttributes[attr])
    )
  ) || variants[0];

  // Calculate the price, adding price_extra for selected attributes
  const calculatePrice = () => {
    const basePrice = activeVariant.price ?? product.list_price ?? 0;
    const extraPrice = activeVariant.attributes.reduce((acc, attr) => {
      // Add price_extra for the selected attributes
      if (selectedAttributes[attr.attribute_name] === attr.value_name) {
        return acc + (attr.price_extra ?? 0);
      }
      return acc;
    }, 0);
    return basePrice + extraPrice;
  };

  const price = calculatePrice();
  const originalPrice = price * 1.2;
  const inStock = (activeVariant.qty_available ?? product.qty_available ?? 0) > 0;

  const handleAttributeSelect = (attribute, value) => {
  setSelectedAttributes((prev) => {
    const newAttributes = { ...prev, [attribute]: value };
    
    // Find matching variant
    const selected = variants.find((variant) =>
      Object.keys(newAttributes).every(attr =>
        variant.attributes.some(a => a.attribute_name === attr && a.value_name === newAttributes[attr])
      )
    );

    if (selected) {
      onSelectVariant(selected);
    }

    setCurrentPrice(calculatePrice());
    return newAttributes;
  });
};


  // Group attributes by type (e.g., Size, Color)
  const groupAttributesByType = (variants) => {
    const groupedAttributes = {};
    variants.forEach((variant) => {
      variant.attributes?.forEach((attr) => {
        if (!groupedAttributes[attr.attribute_name]) {
          groupedAttributes[attr.attribute_name] = new Set();
        }
        groupedAttributes[attr.attribute_name].add(attr.value_name);
      });
    });
    return groupedAttributes;
  };

  const attributeGroups = groupAttributesByType(variants);

  return (
    <div className="product-details p-6">
      <h1 className="text-3xl font-semibold text-gray-900 mb-1">{product.name}</h1>
      <p className="text-sm text-gray-500 mb-4">{product.category_name}</p>

      <div className="flex items-center text-yellow-500 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            width="18" 
            height="18"
            viewBox="0 0 24 24"
            fill={i < Math.round(product.rating ?? 0) ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            className="mr-1"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-500">
          ({product.numReviews ?? 0} reviews)
        </span>
      </div>

      <div className="flex items-baseline space-x-3 mb-4">
        <span className="text-3xl font-bold text-green-600">${price.toFixed(2)}</span>
        {originalPrice > price && (
          <span className="text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
        )}
      </div>

      {/* Dynamic Attribute Selection */}
      {Object.keys(attributeGroups).map((attribute) => (
        <div key={attribute} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{attribute}:</h2>
          <div className="flex flex-wrap space-x-3">
            {[...attributeGroups[attribute]].map((value) => (
              <button
                key={value}
                className={`text-sm py-2 px-4 border rounded-md transition-all duration-200 ${
                  selectedAttributes[attribute] === value
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-gray-200 text-gray-700 border-gray-400'
                } hover:bg-blue-200`}
                onClick={() => handleAttributeSelect(attribute, value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}

      <p className={`text-sm font-medium ${inStock ? 'text-green-700' : 'text-red-600'} mb-1`}>
        {inStock ? 'In Stock' : 'Out of Stock'}
      </p>
      <p className="text-sm text-gray-700 mb-4">Free shipping on orders over $35</p>
      <p className="text-sm">
        Ships from <span className="font-medium">{product.seller || 'Our Warehouse'}</span>
      </p>
    </div>
  );
};

export default ProductDetails;
