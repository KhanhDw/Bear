import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Post } from '../services/postService';

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

type PostAction =
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_ERROR' };

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
};

const PostContext = createContext<
  | {
      state: PostState;
      dispatch: React.Dispatch<PostAction>;
      addPost: (post: Post) => void;
      updatePost: (post: Post) => void;
      deletePost: (postId: string) => void;
      getPostById: (postId: string) => Post | undefined;
    }
  | undefined
>(undefined);

const postReducer = (state: PostState, action: PostAction): PostState => {
  switch (action.type) {
    case 'SET_POSTS':
      return {
        ...state,
        posts: action.payload,
        loading: false,
      };
    case 'ADD_POST':
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.post_id === action.payload.post_id ? action.payload : post
        ),
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.post_id !== action.payload),
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
    case 'RESET_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  const addPost = (post: Post) => {
    dispatch({ type: 'ADD_POST', payload: post });
  };

  const updatePost = (post: Post) => {
    dispatch({ type: 'UPDATE_POST', payload: post });
  };

  const deletePost = (postId: string) => {
    dispatch({ type: 'DELETE_POST', payload: postId });
  };

  const getPostById = (postId: string) => {
    return state.posts.find(post => post.post_id === postId);
  };

  return (
    <PostContext.Provider
      value={{
        state,
        dispatch,
        addPost,
        updatePost,
        deletePost,
        getPostById,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
};