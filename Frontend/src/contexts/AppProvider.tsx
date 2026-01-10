// src/contexts/AppProvider.tsx
import React, { type ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { PostProvider } from './PostContext';
import { CommentProvider } from './CommentContext';

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
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