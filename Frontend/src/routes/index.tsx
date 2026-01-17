import { Routes, Route } from 'react-router-dom';
import FeedPage from '../pages/FeedPage';
import PostDetailPage from '../pages/PostDetailPage';
import UserProfilePage from '../pages/UserProfilePage';
import SearchResultsPage from '../pages/SearchResultsPage';
import VoteHistoryPage from '../pages/VoteHistoryPage';
import CommentPage from '../pages/CommentPage';
import CreatePostPage from '../pages/CreatePostPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import WelcomePage from '../pages/WelcomePage';
import ProtectedRoute from '../components/ProtectedRoute';
import { Suspense } from 'react';

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/feed" element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        } />
        <Route path="/post/:id" element={
          <ProtectedRoute>
            <PostDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/user/:id?" element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchResultsPage />
          </ProtectedRoute>
        } />
        <Route path="/vote" element={
          <ProtectedRoute>
            <VoteHistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/comment/:id?" element={
          <ProtectedRoute>
            <CommentPage />
          </ProtectedRoute>
        } />
        <Route path="/create-post" element={
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<WelcomePage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;