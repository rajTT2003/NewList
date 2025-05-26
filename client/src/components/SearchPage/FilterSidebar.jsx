import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left font-semibold text-gray-700 hover:text-black"
      >
        {title}
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="mt-2 space-y-2 text-sm text-gray-700">{children}</div>}
    </div>
  );
};

const FilterSidebar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFilters(prev => ({ ...prev, [name]: val }));
  };

  const handleMultiCheckbox = (name, value) => {
    setFilters(prev => {
      const current = new Set(prev[name] || []);
      current.has(value) ? current.delete(value) : current.add(value);
      return { ...prev, [name]: [...current] };
    });
  };

  const categories = ['electronics', 'books', 'fashion'];
  const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas'];
  const ratings = [4, 3, 2, 1];

  return (
    <div className="bg-white p-5 rounded shadow-md text-sm space-y-6 sticky top-4">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">Filter Results</h3>

      {/* Category Section */}
      <FilterSection title="Category">
        {categories.map(cat => (
          <label key={cat} className="flex items-center">
            <input
              type="radio"
              name="category"
              value={cat}
              checked={filters.category === cat}
              onChange={handleChange}
              className="mr-2"
            />
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </label>
        ))}
        <label className="flex items-center">
          <input
            type="radio"
            name="category"
            value="all"
            checked={filters.category === 'all'}
            onChange={handleChange}
            className="mr-2"
          />
          All Categories
        </label>
      </FilterSection>

      {/* Brand Section */}
      <FilterSection title="Brand">
        {brands.map(brand => (
          <label key={brand} className="flex items-center">
            <input
              type="checkbox"
              name="brands"
              checked={filters.brands?.includes(brand) || false}
              onChange={() => handleMultiCheckbox('brands', brand)}
              className="mr-2"
            />
            {brand}
          </label>
        ))}
      </FilterSection>

      {/* Price Section */}
      <FilterSection title="Max Price">
        <input
          type="range"
          name="price"
          min="0"
          max="2000"
          step="50"
          value={filters.price}
          onChange={handleChange}
          className="w-full"
        />
        <div className="text-xs text-gray-500 mt-1">Up to ${filters.price}</div>
      </FilterSection>

      {/* Rating Section */}
      <FilterSection title="Customer Rating">
        {ratings.map(r => (
          <label key={r} className="flex items-center">
            <input
              type="radio"
              name="rating"
              value={r}
              checked={Number(filters.rating) === r}
              onChange={handleChange}
              className="mr-2"
            />
            {'★'.repeat(r)}{'☆'.repeat(5 - r)} & up
          </label>
        ))}
      </FilterSection>

      {/* Shipping & Deals */}
      <FilterSection title="More Options">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="freeShipping"
            checked={filters.freeShipping || false}
            onChange={handleChange}
            className="mr-2"
          />
          Free Shipping
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="deal"
            checked={filters.deal || false}
            onChange={handleChange}
            className="mr-2"
          />
          Today's Deals
        </label>
      </FilterSection>

      {/* Clear All Filters */}
      <div>
        <button
          onClick={() =>
            setFilters({
              category: 'all',
              price: 2000,
              rating: 0,
              brands: [],
              freeShipping: false,
              deal: false
            })
          }
          className="text-blue-600 hover:underline text-sm"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
