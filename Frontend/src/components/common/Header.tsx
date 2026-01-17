import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";

interface HeaderProps {
  onDrawerToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDrawerToggle }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { state, logout } = useUserContext();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (state.isAuthenticated && state.currentUser) {
      navigate(`/user/${state.currentUser.id}`);
    } else {
      navigate("/user");
    }
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    closeMenu();
  };

  const handleLogin = () => {
    navigate("/login");
    closeMenu();
  };

  return (
    <header className="header">
      <button
        className="header-button"
        onClick={onDrawerToggle}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <Link to="/feed" className="header-title">
        Bear Social
      </Link>

      {/* Search bar placeholder */}
      <div
        className="search-bar-placeholder"
        style={{ flexGrow: 1, maxWidth: "400px", margin: "0 16px" }}
      >
        <input
          type="text"
          placeholder="Search..."
          className="form-input"
          style={{ width: "100%", padding: "8px 12px" }}
        />
      </div>

      {/* Notification icons placeholder */}
      <div
        className="header-notifications"
        style={{ display: "flex", gap: "16px", marginRight: "16px" }}
      >
        <button className="header-button" aria-label="Messages">
          ✉️
        </button>
        <button className="header-button" aria-label="Notifications">
          🔔
        </button>
      </div>

      <div className="header-profile">
        {state.isAuthenticated && state.currentUser ? (
          <div className="relative">
            <button
              className="header-button"
              onClick={toggleMenu}
              aria-label="User menu"
              aria-expanded={menuOpen}
            >
              <div className="avatar">
                {state.currentUser.firstName?.charAt(0) ||
                  state.currentUser.username.charAt(0)}
              </div>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                style={{ top: "100%", minWidth: "160px" }}
              >
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleProfileClick}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  My account
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <button
              className="header-button"
              onClick={toggleMenu}
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              <div className="avatar">?</div>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                style={{ top: "100%", minWidth: "160px" }}
              >
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
