import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="main-navbar">
      <div className="nav-brand">
        <Link to="/">
          <span className="logo-text">jas</span>
          <span className="logo-accent">Built</span>
        </Link>
      </div>

      <div className="nav-actions">
        <Link to="/leaderboard" className="nav-link">
          🏆 Leaderboard
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/submit" className="btn-ship">
              Ship Something 🚀
            </Link>

            <Link
              to={`/profile/${user?.username}`}
              className="nav-profile-link"
            >
              <span className="user-avatar-placeholder">💻</span>
              <span className="user-name-tag">
                @{user?.username}
              </span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="btn-logout"
            >
              Exit
            </button>
          </>
        ) : (
          <Link to="/auth" className="btn-login">
            Join Ecosystem ↗
          </Link>
        )}
      </div>
    </nav>
  );
}