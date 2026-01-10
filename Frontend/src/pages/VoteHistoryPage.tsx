import { Box, Typography, Container, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper } from '@mui/material';
import { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';

const VoteHistoryPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sample vote data
  const sampleVotes = [
    {
      id: '1',
      type: 'post',
      title: 'Beautiful sunset photo',
      author: 'Jane Smith',
      voteType: 'upvote',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'comment',
      title: 'Great hiking spot recommendation',
      author: 'Bob Johnson',
      voteType: 'upvote',
      time: '1 day ago'
    },
    {
      id: '3',
      type: 'post',
      title: 'New recipe for dinner',
      author: 'Alice Brown',
      voteType: 'downvote',
      time: '2 days ago'
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
            Vote History
          </Typography>
          <Paper sx={{ mt: 2 }}>
            <List>
              {sampleVotes.map((vote) => (
                <ListItem key={vote.id} divider>
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: vote.voteType === 'upvote' ? 'success.main' : 'error.main' 
                      }}
                    >
                      {vote.voteType === 'upvote' ? '👍' : '👎'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${vote.voteType === 'upvote' ? 'Upvoted' : 'Downvoted'} ${vote.type} "${vote.title}"`}
                    secondary={`by ${vote.author} • ${vote.time}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default VoteHistoryPage;