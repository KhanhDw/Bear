import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BiHome, BiSearch, BiEdit, BiUser, BiComment, BiLike, BiLogOut } from 'react-icons/bi';
import { useUserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, logout } = useUserContext();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarItems = [
    { text: 'Home', path: '/', icon: <BiHome size={20} /> },
    { text: 'Feed', path: '/feed', icon: <BiHome size={20} /> },
    { text: 'Search', path: '/search', icon: <BiSearch size={20} /> },
    { text: 'Create Post', path: '/create-post', icon: <BiEdit size={20} /> },
    { text: 'Profile', path: state.currentUser ? `/user/${state.currentUser.id}` : '/user', icon: <BiUser size={20} /> },
    { text: 'Comments', path: '/comment', icon: <BiComment size={20} /> },
    { text: 'Votes', path: '/vote-history', icon: <BiLike size={20} /> },
  ];

  return (
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarMobile : ''} ${mobileOpen ? styles.open : ''}`}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {state.currentUser 
            ? state.currentUser.firstName?.charAt(0) || state.currentUser.username.charAt(0)
            : 'U'}
        </div>
        <span className={styles.userName}>
          {state.currentUser ? state.currentUser.username : 'Guest'}
        </span>
      </div>
      <hr className={styles.divider} />
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {sidebarItems.map((item) => (
            <li key={item.text}>
              <Link
                to={item.path}
                className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
                onClick={handleDrawerToggle}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navText}>{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <hr className={styles.divider} />
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li>
            <button className={styles.navLink} onClick={handleLogout}>
              <span className={styles.navIcon}><BiLogOut size={20} /></span>
              <span className={styles.navText}>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;