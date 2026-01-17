// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { mockAuthService } from '../mocks/auth';

export const useAuth = () => {
  const { state, login, logout } = useUserContext();

  useEffect(() => {
    // On component mount, check if user is already authenticated
    const checkAuthStatus = async () => {
      try {
        const user = await mockAuthService.getCurrentUser();
        if (user) {
          login(user);
        }
      } catch (error) {
        console.error('Failed to restore authentication state:', error);
      }
    };

    if (!state.loading && state.currentUser === null && !state.isAuthenticated) {
      checkAuthStatus();
    }
  }, [state, login]);

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await mockAuthService.login(email, password);
      login(user);
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signUp = async (userData: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
    username: string;
  }) => {
    try {
      const { user } = await mockAuthService.register(userData);
      login(user);
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await mockAuthService.logout();
      logout();
    } catch (error) {
      console.error('Failed to sign out:', error);
      logout(); // Still clear local state even if mock service fails
    }
  };

  return {
    user: state.currentUser,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.loading,
    error: state.error,
    signIn,
    signUp,
    signOut,
  };
};