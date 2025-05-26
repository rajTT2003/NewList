import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import Button from '../ui/Button';
import SearchInput from '../ui/SearchInput';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm) query.set('q', searchTerm);
    if (category !== 'All') query.set('category', category);
    navigate(`/search?${query.toString()}`);
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between relative">
      {/* Logo */}
      <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
        NewList
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-l px-2 bg-gray-100 text-black border border-gray-300"
        >
          <option>All</option>
          <option>Electronics</option>
          <option>Books</option>
          <option>Fashion</option>
        </select>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-none border-l-0 border-r-0 flex-1"
        />
        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-r"
        >
          <FaSearch />
        </button>
      </form>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Auth Info */}
        <div className="hidden md:block text-xs text-right">
          <span className="text-gray-300">
            {user ? `Hello, ${user.name}` : 'Hello, Sign in'}
          </span>
          <br />
          <span className="font-semibold cursor-pointer" onClick={() => {
            if (user) logout();
            else navigate('/login');
          }}>
            {user ? 'Logout' : 'Account & Lists'}
          </span>
        </div>

        {/* Cart */}
        <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
          <FaShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full px-1">
              {cartCount}
            </span>
          )}
        </div>

        {/* Hamburger */}
        <div className="md:hidden w-6 flex justify-center">
          <button className="text-xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-800 text-white p-4 flex flex-col md:hidden z-50">
          <form onSubmit={handleSearch} className="flex w-full mb-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-l-md px-2 bg-gray-100 text-black border border-gray-300"
            >
              <option>All</option>
              <option>Electronics</option>
              <option>Books</option>
              <option>Fashion</option>
            </select>
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-none border-l-0 border-r-0 flex-1"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-r-md"
            >
              <FaSearch />
            </button>
          </form>
          <span className="cursor-pointer" onClick={() => navigate('/login')}>
            Login / Register
          </span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
