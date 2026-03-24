import React, { useState } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useNavigate, Link } from 'react-router';
import './Navbar.scss';

const Navbar = () => {
  const { user, handlelogout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onLogout = async () => {
    const success = await handlelogout();
    if (success) {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="navbar__logo-text">ResumeFit <span className="highlight">AI</span></span>
        </Link>

        {user && (
          <div className="navbar__profile">
            <div 
              className="navbar__user" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="navbar__avatar">
                {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="navbar__username">{user.username || 'User'}</span>
              <svg className={`navbar__chevron ${isDropdownOpen ? 'open' : ''}`} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {isDropdownOpen && (
              <div className="navbar__dropdown">
                <div className="navbar__dropdown-header">
                  <p className="navbar__dropdown-name">{user.username || 'User'}</p>
                  <p className="navbar__dropdown-email">{user.email}</p>
                </div>
                <div className="navbar__dropdown-divider" />
                <button className="navbar__dropdown-item" onClick={() => navigate('/')}>
                  Dashboard
                </button>
                <button className="navbar__dropdown-item logout" onClick={onLogout}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
