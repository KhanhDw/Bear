import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import {
  Home as HomeIcon,
  Person as UserIcon,
  Chat as CommentIcon,
  Search as SearchIcon,
  RssFeed as FeedIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname);

  React.useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  return (
    <Paper 
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} 
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction 
          label="Home" 
          value="/" 
          icon={<HomeIcon />} 
          component={Link} 
          to="/"
        />
        <BottomNavigationAction 
          label="Feed" 
          value="/feed" 
          icon={<FeedIcon />} 
          component={Link} 
          to="/feed"
        />
        <BottomNavigationAction 
          label="Search" 
          value="/search" 
          icon={<SearchIcon />} 
          component={Link} 
          to="/search"
        />
        <BottomNavigationAction 
          label="Profile" 
          value="/user" 
          icon={<UserIcon />} 
          component={Link} 
          to="/user"
        />
        <BottomNavigationAction 
          label="Comments" 
          value="/comment" 
          icon={<CommentIcon />} 
          component={Link} 
          to="/comment"
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navigation;