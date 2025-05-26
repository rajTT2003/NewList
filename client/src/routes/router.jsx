// src/router/AppRouter.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from '../layout/Layout';
import AuthLayout from '../layout/AuthLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import Search from '../pages/Search';
import ProductPage from '../components/ProductPage/ProductPage';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import Signup from '../pages/SignUp';
import OAuthSuccess from '../pages/OAuthSuccess';

export default function AppRouter() {
  return (
    <Routes>
      {/* Main layout for the app */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="search" element={<Search />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="cart" element={<Cart />} />
      </Route>

      {/* Separate layout for auth pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

      </Route>
    </Routes>
  );
}
