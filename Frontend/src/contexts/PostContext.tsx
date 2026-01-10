// src/contexts/PostContext.tsx
import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Post } from '../services/postService';

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
}

type PostAction =
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'SET_CURRENT_POST'; payload: Post | null }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LIKE_POST'; payload: { postId: string; likesCount: number } }
  | { type: 'ADD_COMMENT_TO_POST'; payload: { postId: string; commentCount: number } };

const initialState: PostState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
};

const PostContext = createContext<
  | {
      state: PostState;
      dispatch: React.Dispatch<PostAction>;
      addPost: (post: Post) => void;
      updatePost: (post: Post) => void;
      deletePost: (id: string) => void;
      setCurrentPost: (post: Post | null) => void;
      likePost: (postId: string, likesCount: number) => void;
      addCommentToPost: (postId: string, commentCount: number) => void;
    }
  | undefined
>(undefined);

const postReducer = (state: PostState, action: PostAction): PostState => {
  switch (action.type) {
    case 'SET_POSTS':
      return {
        ...state,
        posts: action.payload,
      };
    case 'SET_CURRENT_POST':
      return {
        ...state,
        currentPost: action.payload,
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
          post.id === action.payload.id ? action.payload : post
        ),
        currentPost:
          state.currentPost?.id === action.payload.id
            ? action.payload
            : state.currentPost,
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
        currentPost:
          state.currentPost?.id === action.payload
            ? null
            : state.currentPost,
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
    case 'LIKE_POST':
      // Update in currentPost if it matches
      const updatedCurrentPost = 
        state.currentPost?.id === action.payload.postId
          ? { ...state.currentPost, likesCount: action.payload.likesCount }
          : state.currentPost;
      
      // Update in posts list
      const updatedPosts = state.posts.map(post =>
        post.id === action.payload.postId
          ? { ...post, likesCount: action.payload.likesCount }
          : post
      );

      return {
        ...state,
        currentPost: updatedCurrentPost,
        posts: updatedPosts,
      };
    case 'ADD_COMMENT_TO_POST':
      // Update in currentPost if it matches
      const currentPostWithComment = 
        state.currentPost?.id === action.payload.postId
          ? { ...state.currentPost, commentsCount: action.payload.commentCount }
          : state.currentPost;
      
      // Update in posts list
      const postsWithComment = state.posts.map(post =>
        post.id === action.payload.postId
          ? { ...post, commentsCount: action.payload.commentCount }
          : post
      );

      return {
        ...state,
        currentPost: currentPostWithComment,
        posts: postsWithComment,
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

  const deletePost = (id: string) => {
    dispatch({ type: 'DELETE_POST', payload: id });
  };

  const setCurrentPost = (post: Post | null) => {
    dispatch({ type: 'SET_CURRENT_POST', payload: post });
  };

  const likePost = (postId: string, likesCount: number) => {
    dispatch({ type: 'LIKE_POST', payload: { postId, likesCount } });
  };

  const addCommentToPost = (postId: string, commentCount: number) => {
    dispatch({ type: 'ADD_COMMENT_TO_POST', payload: { postId, commentCount } });
  };

  return (
    <PostContext.Provider
      value={{
        state,
        dispatch,
        addPost,
        updatePost,
        deletePost,
        setCurrentPost,
        likePost,
        addCommentToPost,
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