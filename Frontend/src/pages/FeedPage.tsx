import { Box, Typography, Container } from '@mui/material';
import { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import PostCard from '../components/ui/PostCard';

const FeedPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sample data for demonstration
  const samplePosts = [
    {
      id: '1',
      authorName: 'John Doe',
      authorAvatar: '/static/images/avatar/1.jpg',
      content: 'Just finished an amazing hike in the mountains! The view was absolutely breathtaking.',
      imageUrl: '/static/images/post/1.jpg',
      likesCount: 24,
      commentsCount: 5,
      createdAt: '2 hours ago'
    },
    {
      id: '2',
      authorName: 'Jane Smith',
      authorAvatar: '/static/images/avatar/2.jpg',
      content: 'Working on a new project using React and Material UI. So excited about the possibilities!',
      likesCount: 42,
      commentsCount: 12,
      createdAt: '5 hours ago'
    },
    {
      id: '3',
      authorName: 'Bob Johnson',
      authorAvatar: '/static/images/avatar/3.jpg',
      content: 'Just adopted a new puppy. Meet Charlie, the newest member of our family!',
      imageUrl: '/static/images/post/2.jpg',
      likesCount: 87,
      commentsCount: 21,
      createdAt: '1 day ago'
    }
  ];

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
            Feed
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {samplePosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                authorName={post.authorName}
                authorAvatar={post.authorAvatar}
                content={post.content}
                imageUrl={post.imageUrl}
                likesCount={post.likesCount}
                commentsCount={post.commentsCount}
                createdAt={post.createdAt}
              />
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default FeedPage;