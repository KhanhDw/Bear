import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();

  const sidebarItems = [
    { text: 'Home', path: '/' },
    { text: 'Feed', path: '/feed' },
    { text: 'Search', path: '/search' },
    { text: 'Create Post', path: '/create-post' },
    { text: 'Profile', path: '/user' },
    { text: 'Comments', path: '/comment' },
    { text: 'Votes', path: '/vote' },
  ];

  return (
    <aside className={`sidebar ${mobileOpen ? 'sidebar-mobile open' : ''}`}>
      <div className="p-4 flex items-center">
        <div className="avatar mr-3">U</div>
        <span>User Name</span>
      </div>
      <hr className="my-2" />
      <nav>
        <ul className="list-none p-0 m-0">
          {sidebarItems.map((item) => (
            <li key={item.text}>
              <Link
                to={item.path}
                className={`block py-2 px-4 text-gray-700 hover:bg-gray-100 ${
                  location.pathname === item.path ? 'bg-gray-200 font-medium' : ''
                }`}
                onClick={handleDrawerToggle}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <hr className="my-2" />
      <nav>
        <ul className="list-none p-0 m-0">
          <li>
            <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">
              Saved
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">
              Archive
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;