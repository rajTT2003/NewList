// src/layout/AuthLayout.jsx
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
