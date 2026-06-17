import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ✅ ENHANCEMENT: Use lazy initializers so localStorage reads only fire ONCE on mount, not on every render
  const [token, setToken] = useState(() => localStorage.getItem('jasbuilt_token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('jasbuilt_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Context state restoration now safely completes before lifting the screen curtain
    setLoading(false);
  }, []);

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
      {/* Guard prevents children from rendering briefly with partial/unloaded state values */}
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
