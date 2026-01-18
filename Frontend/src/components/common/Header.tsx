import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import { BiMenu, BiEnvelope, BiBell, BiUser } from 'react-icons/bi';
import SearchBar from '../ui/SearchBar';
import styles from './Header.module.css';

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
    <header className={styles.header}>
      <button
        className={styles.menuButton}
        onClick={onDrawerToggle}
        aria-label="Toggle menu"
      >
        <BiMenu size={20} />
      </button>

      <Link to="/feed" className={styles.logo}>
        Bear Social
      </Link>

      <div className={styles.searchContainer}>
        <SearchBar />
      </div>

      <div className={styles.notifications}>
        <button className={styles.iconButton} aria-label="Messages">
          <BiEnvelope size={20} />
        </button>
        <button className={styles.iconButton} aria-label="Notifications">
          <BiBell size={20} />
        </button>
      </div>

      <div className={styles.profile}>
        {state.isAuthenticated && state.currentUser ? (
          <div className={styles.profileDropdown}>
            <button
              className={styles.avatarButton}
              onClick={toggleMenu}
              aria-label="User menu"
              aria-expanded={menuOpen}
            >
              <div className={styles.avatar}>
                {state.currentUser.firstName?.charAt(0) ||
                  state.currentUser.username.charAt(0)}
              </div>
            </button>

            {menuOpen && (
              <div className={styles.dropdownMenu}>
                <button
                  className={styles.dropdownItem}
                  onClick={handleProfileClick}
                >
                  Profile
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={closeMenu}
                >
                  My account
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.profileDropdown}>
            <button
              className={styles.avatarButton}
              onClick={toggleMenu}
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              <div className={styles.avatar}>
                <BiUser size={16} />
              </div>
            </button>

            {menuOpen && (
              <div className={styles.dropdownMenu}>
                <button
                  className={styles.dropdownItem}
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
