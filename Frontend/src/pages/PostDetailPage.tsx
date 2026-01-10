import { Box, Typography, Container } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import PostCard from '../components/ui/PostCard';
import CommentCard from '../components/ui/CommentCard';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sample data for demonstration
  const samplePost = {
    id: id || '1',
    authorName: 'John Doe',
    authorAvatar: '/static/images/avatar/1.jpg',
    content: 'Just finished an amazing hike in the mountains! The view was absolutely breathtaking. This is a longer post to demonstrate how content looks in the detail view.',
    imageUrl: '/static/images/post/1.jpg',
    likesCount: 24,
    commentsCount: 5,
    createdAt: '2 hours ago'
  };

  const sampleComments = [
    {
      id: '1',
      authorName: 'Jane Smith',
      authorAvatar: '/static/images/avatar/2.jpg',
      content: 'Looks amazing! Where exactly did you hike?',
      likesCount: 3,
      createdAt: '1 hour ago'
    },
    {
      id: '2',
      authorName: 'Bob Johnson',
      authorAvatar: '/static/images/avatar/3.jpg',
      content: 'Beautiful view! Thanks for sharing.',
      likesCount: 1,
      createdAt: '30 minutes ago'
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
            Post Detail - {id}
          </Typography>
          <PostCard
            id={samplePost.id}
            authorName={samplePost.authorName}
            authorAvatar={samplePost.authorAvatar}
            content={samplePost.content}
            imageUrl={samplePost.imageUrl}
            likesCount={samplePost.likesCount}
            commentsCount={samplePost.commentsCount}
            createdAt={samplePost.createdAt}
          />
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Comments ({sampleComments.length})
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {sampleComments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  id={comment.id}
                  authorName={comment.authorName}
                  authorAvatar={comment.authorAvatar}
                  content={comment.content}
                  likesCount={comment.likesCount}
                  createdAt={comment.createdAt}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PostDetailPage;