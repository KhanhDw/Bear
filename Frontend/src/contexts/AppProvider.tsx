// src/contexts/AppProvider.tsx
import React, { type ReactNode, useEffect } from 'react';
import { UserProvider } from './UserContext';
import { PostProvider } from './PostContext';
import { CommentProvider } from './CommentContext';
import { mockAuthService } from '../mocks/auth';

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await mockAuthService.getCurrentUser();
        if (user) {
          // Dispatch an action to set the user in context
          // Since we can't directly dispatch here, we'll rely on the context initialization
          // The UserContext will handle checking auth status on first render
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
      }
    };

    initializeAuth();
  }, []);

  return (
    <UserProvider>
      <PostProvider>
        <CommentProvider>
          {children}
        </CommentProvider>
      </PostProvider>
    </UserProvider>
  );
};

export default AppProvider;