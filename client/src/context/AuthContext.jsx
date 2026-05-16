import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function - calls backend API
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await userAPI.login(email, password);
      const { user: userData, token } = response;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userData._id); // Store userId for API calls
      navigate('/app');
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Signup function - calls backend API
  const signup = async (name, email, password) => {
    try {
      setError(null);
      const response = await userAPI.register(name, email, password);
      const { user: userData, token } = response;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userData._id); // Store userId for API calls
      navigate('/app');
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

const logout = () => {
  setUser(null);
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  // Use setTimeout to ensure state updates first
  setTimeout(() => {
    navigate('/', { replace: true });
  }, 0);
};
 

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};