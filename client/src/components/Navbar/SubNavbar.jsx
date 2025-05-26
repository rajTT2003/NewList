import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

const SubNavbar = () => {
  const { categories } = useProducts();
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    const queryParam = category === 'All' ? '' : `?category=${encodeURIComponent(category)}`;
    navigate(`/search${queryParam}`);
  };

  // Ensure categories are just strings (extract name if they are objects)
  const allCategories = [ ...categories.map(cat => cat.name)];

  return (
    <div className="bg-yellow-400 px-4 py-2 text-black text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
      <ul className="flex gap-4 md:justify-start justify-between">
        {allCategories.map((cat) => (
          <li
            key={cat} // Key should be a string, use `cat` directly
            onClick={() => handleCategoryClick(cat)}
            className="cursor-pointer p-1 rounded-sm flex-shrink-0 hover:bg-yellow-600 transition"
          >
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubNavbar;
