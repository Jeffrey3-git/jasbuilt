import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Trophy, Menu, X } from 'lucide-react';
import { AuthProvider, useAuth } from './hooks/useAuth';

import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Submit } from './pages/Submit';
import { Profile } from './pages/Profile';
import { Leaderboard } from './pages/Leaderboard';
import { ProjectDetail } from './pages/ProjectDetail';

const GlobalNavigationBar = () => {
  const { isAuthenticated, user, logoutSession } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="global-navbar">
      <div className="nav-brand">
        <Link to="/" onClick={closeMenu}>
          <img src="/favicon.svg" alt="" width="24" height="24" />
          JASBuilt
        </Link>
      </div>

      <div className="nav-right">
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Feed</Link>
          <Link to="/leaderboard" className="nav-link-accent" onClick={closeMenu}>
            <Trophy size={15} strokeWidth={2.25} />
            Leaderboard
          </Link>

          {isAuthenticated && (
            <Link to={`/profile/${user?.username}`} className="nav-username" onClick={closeMenu}>
              @{user?.username}
            </Link>
          )}
        </div>

        {isAuthenticated ? (
          <button onClick={() => { logoutSession(); closeMenu(); }} className="btn-logout">
            Sign Out
          </button>
        ) : (
          <Link to="/auth" className="btn-signin" onClick={closeMenu}>
            Sign In
          </Link>
        )}

        <button
          className="nav-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
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
            path="/projects/:id"
            element={<ProjectDetail />}
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
