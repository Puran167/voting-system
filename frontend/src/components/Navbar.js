import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">&#128499; Smart Voting</Link>
      </div>

      <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
        {!user && (
          <>
            <Link to="/login" className={isActive('/login')}>Login</Link>
            <Link to="/register" className={isActive('/register')}>Register</Link>
          </>
        )}

        {user && user.role === 'admin' && (
          <>
            <Link to="/admin" className={isActive('/admin')}>Dashboard</Link>
            <Link to="/admin/voters" className={isActive('/admin/voters')}>Voters</Link>
            <Link to="/admin/candidates" className={isActive('/admin/candidates')}>Candidates</Link>
            <Link to="/admin/voting-time" className={isActive('/admin/voting-time')}>Voting Time</Link>
            <Link to="/admin/results" className={isActive('/admin/results')}>Results</Link>
            <Link to="/admin/logs" className={isActive('/admin/logs')}>Logs</Link>
          </>
        )}

        {user && user.role === 'voter' && (
          <>
            <Link to="/voter" className={isActive('/voter')}>Dashboard</Link>
            <Link to="/voter/vote" className={isActive('/voter/vote')}>Vote</Link>
          </>
        )}

        {/* Mobile-only actions */}
        <div className="mobile-nav-actions">
          {user && (
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="navbar-actions">
        <LanguageSelector className="navbar-lang-selector" />
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark mode">
          {darkMode ? '☀️' : '🌙'}
        </button>

        {user && (
          <button className="btn btn-logout desktop-only" onClick={handleLogout}>
            Logout
          </button>
        )}

        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
