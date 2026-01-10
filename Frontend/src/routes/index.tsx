import { Routes, Route } from 'react-router-dom';
import FeedPage from '../pages/FeedPage';
import PostDetailPage from '../pages/PostDetailPage';
import UserProfilePage from '../pages/UserProfilePage';
import SearchResultsPage from '../pages/SearchResultsPage';
import VoteHistoryPage from '../pages/VoteHistoryPage';
import CommentPage from '../pages/CommentPage';
import CreatePostPage from '../pages/CreatePostPage';
import { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const AppRoutes = () => {
  return (
    <Suspense 
      fallback={
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      }
    >
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/user/:id?" element={<UserProfilePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/vote" element={<VoteHistoryPage />} />
        <Route path="/comment/:id?" element={<CommentPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="*" element={<FeedPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;