import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jasbuilt_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If token exists on load, restore context state
    const savedUser = localStorage.getItem('jasbuilt_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const loginSession = (userData, userToken) => {
    localStorage.setItem('jasbuilt_token', userToken);
    localStorage.setItem('jasbuilt_user', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const logoutSession = () => {
    localStorage.removeItem('jasbuilt_token');
    localStorage.removeItem('jasbuilt_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginSession, logoutSession, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be nested inside an AuthProvider component factory');
  }
  return context;
};