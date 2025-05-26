// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      const res = await api.post('/api/login', { email, password });
      await login(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://newlist-server-n141.onrender.com/auth/google'; // adjust for production if needed
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white border border-gray-300 p-8 rounded-md w-full max-w-md shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Sign in</h1>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-400 rounded-sm p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-400 rounded-sm p-2 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold p-2 rounded-sm border border-yellow-600"
          >
            Sign in
          </button>
        </form>

        <div className="text-xs text-blue-600 hover:underline mt-3">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>

        <div className="my-4 text-center text-xs text-gray-500">or</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-400 hover:bg-gray-100 text-sm font-medium p-2 rounded-sm"
        >
          Sign in with Google
        </button>

        <div className="mt-6 border-t pt-4 text-sm text-center">
          <span className="text-gray-600">New to NewList?</span>{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create your account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
