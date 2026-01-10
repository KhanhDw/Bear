import { Box, Typography, Container } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import UserProfileCard from '../components/ui/UserProfileCard';
import PostCard from '../components/ui/PostCard';

const UserProfilePage = () => {
  const { id } = useParams<{ id?: string }>();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sample user data
  const sampleUser = {
    id: id || '1',
    name: id ? `User ${id}` : 'Current User',
    username: id ? `user${id}` : 'currentuser',
    bio: id 
      ? `This is the profile for user ${id}. They enjoy hiking, photography, and sharing their experiences with the community.` 
      : 'This is your profile. You enjoy hiking, photography, and sharing your experiences with the community.',
    profilePictureUrl: '/static/images/avatar/1.jpg',
    coverImageUrl: '/static/images/cover/1.jpg',
    postsCount: 24,
    followersCount: 128,
    followingCount: 87
  };

  // Sample posts for the user
  const samplePosts = [
    {
      id: '1',
      authorName: sampleUser.name,
      authorAvatar: sampleUser.profilePictureUrl,
      content: 'Just finished an amazing hike in the mountains! The view was absolutely breathtaking.',
      imageUrl: '/static/images/post/1.jpg',
      likesCount: 24,
      commentsCount: 5,
      createdAt: '2 hours ago'
    },
    {
      id: '2',
      authorName: sampleUser.name,
      authorAvatar: sampleUser.profilePictureUrl,
      content: 'Beautiful sunset tonight. Nature never fails to amaze me.',
      likesCount: 42,
      commentsCount: 12,
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
          <UserProfileCard
            name={sampleUser.name}
            username={sampleUser.username}
            bio={sampleUser.bio}
            profilePictureUrl={sampleUser.profilePictureUrl}
            coverImageUrl={sampleUser.coverImageUrl}
            postsCount={sampleUser.postsCount}
            followersCount={sampleUser.followersCount}
            followingCount={sampleUser.followingCount}
          />
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Posts ({samplePosts.length})
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
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default UserProfilePage;