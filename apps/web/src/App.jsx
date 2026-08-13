import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Submit } from './pages/Submit';
import { Profile } from './pages/Profile';
import { Leaderboard } from './pages/Leaderboard';

const GlobalNavigationBar = () => {
  const { isAuthenticated, user, logoutSession } = useAuth();

  return (
    <nav className="global-navbar">
      <div className="nav-brand">
        <Link to="/">
          <img src="/favicon.svg" alt="" width="24" height="24" />
          JASBuilt
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Feed</Link>
        <Link to="/leaderboard" className="nav-link-accent">🏆 Leaderboard</Link>

        {isAuthenticated ? (
          <>
            <Link to={`/profile/${user?.username}`} className="nav-username">
              @{user?.username}
            </Link>
            <button onClick={logoutSession} className="btn-logout">
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/auth" className="btn-signin">
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
