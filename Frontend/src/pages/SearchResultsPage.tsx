import { Box, Typography, Container, Paper } from '@mui/material';
import { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import SearchBar from '../components/ui/SearchBar';

const SearchResultsPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onDrawerToggle={handleDrawerToggle} />
      <Sidebar 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)} 
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${240}px)` },
          minHeight: '100vh',
          marginTop: '64px',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom>
            Search
          </Typography>
          <Paper sx={{ p: 2, mb: 3 }}>
            <SearchBar />
          </Paper>
          <Typography variant="h5" component="h2" gutterBottom>
            Search Results
          </Typography>
          <Typography variant="body1">
            This is the search results page where search results will be displayed.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default SearchResultsPage;