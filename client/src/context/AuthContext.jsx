// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchUser = async (newToken = token) => {
    try {
      if (!newToken) {
        setUser(null);
        return;
      }

      const decodedToken = jwtDecode(newToken);
      if (decodedToken.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      const res = await api.get('/api/me', {
        headers: { Authorization: `Bearer ${newToken}` },
      });

      const loggedInUser = res.data.user || null;
      setUser(loggedInUser);
    } catch (err) {
      console.error('Fetch user failed:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        logout();
      } else {
        setUser(null);
      }
    }
  };

  const login = async (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    await fetchUser(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
