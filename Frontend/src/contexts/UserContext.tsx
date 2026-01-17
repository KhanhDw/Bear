// src/contexts/UserContext.tsx
import React, { createContext, useContext, useReducer, type ReactNode, useEffect } from 'react';
import type { User } from '../services/userService';
import { mockAuthService } from '../mocks/auth';

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type UserAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTH_STATUS'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: true, // Start with loading true to check auth status
  error: null,
};

const UserContext = createContext<
  | {
      state: UserState;
      dispatch: React.Dispatch<UserAction>;
      login: (user: User) => void;
      logout: () => void;
      updateUser: (userData: Partial<User>) => void;
    }
  | undefined
>(undefined);

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: !!action.payload,
      };
    case 'SET_AUTH_STATUS':
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const user = await mockAuthService.getCurrentUser();
        if (user) {
          dispatch({ type: 'SET_USER', payload: user });
          dispatch({ type: 'SET_AUTH_STATUS', payload: true });
        }
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to check authentication status' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  const login = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
    dispatch({ type: 'SET_AUTH_STATUS', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    mockAuthService.setCurrentUser(user); // Update mock auth service
  };

  const logout = () => {
    mockAuthService.logout(); // Clear mock auth service
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.currentUser) {
      const updatedUser = { ...state.currentUser, ...userData };
      dispatch({ type: 'SET_USER', payload: updatedUser });
      mockAuthService.setCurrentUser(updatedUser); // Update mock auth service
    }
  };

  return (
    <UserContext.Provider
      value={{
        state,
        dispatch,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};