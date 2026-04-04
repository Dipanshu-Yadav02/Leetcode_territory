import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const finishVerification = (newRank, location) => {
    setUser((prev) => ({
      ...prev,
      isVerified: true,
      leetcodeGlobalRank: newRank,
      location
    }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, finishVerification }}>
      {children}
    </AuthContext.Provider>
  );
};
