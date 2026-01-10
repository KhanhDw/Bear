import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Divider,
  Popper,
  ClickAwayListener,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'user' | 'post';
  title: string;
  subtitle?: string;
  avatar?: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  searchResults?: SearchResult[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchResults = [] }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Only show results if there's a query and results available
    if (value.trim() && searchResults.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'user') {
      navigate(`/user/${result.id}`);
    } else {
      navigate(`/post/${result.id}`);
    }
    setOpen(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setOpen(false);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search posts, people..."
          inputProps={{ 'aria-label': 'search' }}
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && searchResults.length > 0 && setOpen(true)}
        />
        {query && (
          <IconButton 
            sx={{ p: '10px' }} 
            aria-label="clear" 
            onClick={clearSearch}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Paper>

      <Popper
        open={open}
        anchorEl={document.querySelector('form') as Element}
        placement="bottom-start"
        style={{ width: '100%', zIndex: 1000 }}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper sx={{ width: '100%', maxHeight: 300, overflow: 'auto' }}>
            <List>
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <ListItem 
                    component="div"
                    key={result.id} 
                    onClick={() => handleResultClick(result)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <ListItemAvatar>
                      <Avatar src={result.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={result.title}
                      secondary={result.subtitle}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem component="div">
                  <ListItemText primary="No results found" />
                </ListItem>
              )}
            </List>
            <Divider />
            <ListItem component="div" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}>
                        <ListItemText primary={`See all results for "${query}"`} />
                      </ListItem>          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default SearchBar;