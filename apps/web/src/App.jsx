import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Submit } from './pages/Submit';
import { Profile } from './pages/Profile';
import { Leaderboard } from './pages/Leaderboard';

// 🆕 UNIVERSAL STICKY NAVIGATION BAR
const GlobalNavigationBar = () => {
  const { isAuthenticated, user, logoutSession } = useAuth();

  return (
    <nav className="global-navbar" style={{
      position: 'sticky',
      top: 0,
      background: '#0b0f17',
      borderBottom: '1px solid #1e293b',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="nav-brand" style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.025em' }}>
        <Link to="/" style={{ color: '#f8fafc', textDecoration: 'none' }}>🚀 JASBuilt</Link>
      </div>

      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Feed</Link>
        
        {/* 🏆 LEADERBOARD LINK ENTRY */}
        <Link to="/leaderboard" style={{ color: '#ff4f00', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>🏆 Leaderboard</Link>
        
        {isAuthenticated ? (
          <>
            <Link to={`/profile/${user?.username}`} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>
              @{user?.username}
            </Link>
            <button 
              onClick={logoutSession} 
              style={{
                background: 'none',
                border: '1px solid #242b3a',
                color: '#ef4444',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/auth" style={{
            background: '#ff4f00',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated
    ? children
    : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Universal Top Layout Menu Anchor */}
        <GlobalNavigationBar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/auth" element={<Auth />} />

          <Route
            path="/submit"
            element={
              <ProtectedRoute>
                <Submit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:username"
            element={<Profile />}
          />

          <Route
            path="/leaderboard"
            element={<Leaderboard />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
