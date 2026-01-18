import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Don't show sidebar on auth pages
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <div className={styles.layout}>
      {!isAuthPage && <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />}
      <div className={`${styles.mainContent} ${!isAuthPage ? styles.withSidebar : ''}`}>
        {!isAuthPage && <Header onDrawerToggle={handleDrawerToggle} />}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
