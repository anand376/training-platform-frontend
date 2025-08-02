import React, { createContext, useState, useEffect } from 'react';
import api, { getCsrfCookie } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [token, setToken] = useState(localStorage.getItem('token') || null);
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    (async () => {
      try {
        await getCsrfCookie();
        const res = await api.get('/me');
        setUser(res.data);
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    })();
  } else {
    setLoading(false);
  }
}, [token]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        await getCsrfCookie();
        const response = await api.get('/me');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user on app load', error);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const loginUser = async (email, password) => {
    const response = await api.post('/login', { email, password });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);

    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    const userRes = await api.get('/me');
    setUser(userRes.data);
  };

  const registerUser = async (name, email, password, password_confirmation, role) => {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation,
      role,
    });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);

    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    const userRes = await api.get('/me');
    setUser(userRes.data);
  };

  const logoutUser = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout failed', err);
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
