import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Periodically check user status every 30 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchUser(true); // Silent refresh
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const fetchUser = async (silent = false) => {
    try {
      if (!silent) {
        console.log('=== Fetching user with token ===');
      }
      const token = localStorage.getItem('token');
      if (!silent) {
        console.log('Token exists:', !!token);
      }
      
      const res = await axios.get(`${API_URL}/api/auth/me`);
      if (!silent) {
        console.log('User fetched:', res.data.user);
        console.log('User role:', res.data.user.role);
      }
      
      setUser(res.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      if (!silent) {
        console.log('Clearing invalid token');
      }
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const refreshUser = async () => {
    await fetchUser(true);
  };

  const login = async (email, password, isAdmin = false) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, { email, password, isAdmin });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    return res.data;
  };

  const register = async (userData) => {
    const res = await axios.post(`${API_URL}/api/auth/register`, userData);
    
    // Check if teacher needs approval
    if (res.data.requiresApproval) {
      return res.data; // Return without setting token/user
    }
    
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
