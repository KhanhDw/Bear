import { Box, Typography, Container, TextField, Button, Paper, Avatar } from '@mui/material';
import { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';

const CreatePostPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [postContent, setPostContent] = useState('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating post:', postContent);
    // In a real app, you would call the post service here
    setPostContent('');
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
            Create New Post
          </Typography>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" gap={2} alignItems="flex-start">
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                U
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      type="submit"
                      disabled={!postContent.trim()}
                    >
                      Post
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default CreatePostPage;