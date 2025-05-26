// src/pages/OAuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log('OAuth token from URL:', token);

    const handleOAuthLogin = async () => {
      if (token) {
        try {
          await login(token); // login handles localStorage and fetchUser
          navigate('/');      // Navigate *after* login completes
        } catch (error) {
          console.error('OAuth login error:', error);
          localStorage.removeItem('token'); // ⬅️ Clean up bad token
          navigate('/login');
        }
      } else {
        console.warn('No token found in URL.');
        navigate('/login');
      }
    };

    handleOAuthLogin();
  }, [login, navigate]);

  return <p>Signing in with Google...</p>;
};

export default OAuthSuccess;
