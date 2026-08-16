import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p className="footer-tagline">The Product Hunt for Ghanaian Student Devs</p>

      <nav className="footer-links">
        <Link to="/">Feed</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/submit">Submit</Link>
      </nav>

      <p className="footer-copyright">&copy; {year} JASBuilt</p>
    </footer>
  );
};
