import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchResultCard from './SearchResultCard';
import FilterSidebar from './FilterSidebar';
import Pagination from './Pagination';
import { useProducts } from '../../context/ProductContext';

const PRODUCTS_PER_PAGE = 8;

const SearchPage = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const query = params.get('q')?.toLowerCase() || '';
  const categoryFromUrl = params.get('category')?.toLowerCase() || 'all';

  // Pull real products from context
  const { products = [], loading } = useProducts();

  const [filters, setFilters] = useState({
    category: categoryFromUrl,
    price: Infinity,
    rating: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Keep URL-driven category in sync
  useEffect(() => {
    setFilters(prev => ({ ...prev, category: categoryFromUrl }));
  }, [categoryFromUrl]);

  // Scroll to top on new search
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [search]);

  // Re-filter whenever products, query or filters change
  useEffect(() => {
    const filtered = products.filter(p => {
      const name   = p.name?.toLowerCase() || '';
      const cat    = p.category_name?.toLowerCase() || 'all';
      const price  = p.list_price ?? 0;
      const rating = p.rating ?? 0;

      const matchesQuery    = name.includes(query);
      const matchesCategory = filters.category === 'all' || cat === filters.category;
      const matchesPrice    = price <= filters.price;
      const matchesRating   = rating >= filters.rating;

      return matchesQuery && matchesCategory && matchesPrice && matchesRating;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, query, filters]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginated = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  if (loading) return <p>Loading products…</p>;

  return (
    <div className="flex flex-col md:flex-row p-4">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 mb-4 md:mb-0 md:mr-6">
        <FilterSidebar filters={filters} setFilters={setFilters} />
      </aside>

      {/* Main */}
      <section className="flex-1">
        <h2 className="text-2xl font-semibold mb-4">Search Results</h2>

        {paginated.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
           {paginated.map(p => (
  <SearchResultCard
    key={p.id}
    product={{
      ...p, // includes all original backend fields like is_variant_product
      price:         p.list_price,
      originalPrice: p.list_price * 1.2,
      rating:        p.rating ?? 4,
      numReviews:    p.numReviews ?? 0,
      image:         p.image, // expected to be a full image URL or base64 string
    }}
  />
))}
          </div>
        )}

        <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 👈 scroll to top on pagination
    setCurrentPage(page);
  }}
/>

      </section>
    </div>
  );
};

export default SearchPage;
