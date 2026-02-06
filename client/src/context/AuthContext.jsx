import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('fosaride_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      axios.defaults.headers.common['x-user-id'] = parsed.id;
      axios.defaults.headers.common['x-user-role'] = parsed.role;
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('fosaride_user', JSON.stringify(userData));
    axios.defaults.headers.common['x-user-id'] = userData.id;
    axios.defaults.headers.common['x-user-role'] = userData.role;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('fosaride_user');
    delete axios.defaults.headers.common['x-user-id'];
    delete axios.defaults.headers.common['x-user-role'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
