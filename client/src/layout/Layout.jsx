// src/layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import SubNavbar from '../components/Navbar/SubNavbar';
import { ProductProvider } from '../context/ProductContext';

const Layout = () => {
  return (
    <ProductProvider>
      <Navbar />
      <SubNavbar />
      <main>
        <Outlet />
      </main>
    </ProductProvider>
  );
};

export default Layout;
