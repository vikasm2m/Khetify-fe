import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Ensure the token isn't expired
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ email: decoded.sub, role: decoded.role });
        } else {
          localStorage.removeItem('token');
        }
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    const token = response.data.access_token;
    localStorage.setItem('token', token);
    
    const decoded = jwtDecode(token);
    setUser({ email: decoded.sub, role: decoded.role });
    return decoded.role;
  };

  const register = async (name, email, password, role) => {
    await api.post('/auth/register', { name, email, password, role });
    // After registration, auto-login
    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
