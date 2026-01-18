import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Comment } from '../services/commentService';

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

type CommentAction =
  | { type: 'SET_COMMENTS'; payload: Comment[] }
  | { type: 'ADD_COMMENT'; payload: Comment }
  | { type: 'UPDATE_COMMENT'; payload: Comment }
  | { type: 'DELETE_COMMENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_ERROR' };

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

const CommentContext = createContext<
  | {
      state: CommentState;
      dispatch: React.Dispatch<CommentAction>;
      addComment: (comment: Comment) => void;
      updateComment: (comment: Comment) => void;
      deleteComment: (commentId: string) => void;
      getCommentsByPostId: (postId: string) => Comment[];
    }
  | undefined
>(undefined);

const commentReducer = (state: CommentState, action: CommentAction): CommentState => {
  switch (action.type) {
    case 'SET_COMMENTS':
      return {
        ...state,
        comments: action.payload,
        loading: false,
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        comments: [action.payload, ...state.comments],
      };
    case 'UPDATE_COMMENT':
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment.id === action.payload.id ? action.payload : comment
        ),
      };
    case 'DELETE_COMMENT':
      return {
        ...state,
        comments: state.comments.filter(comment => comment.id !== action.payload),
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

interface CommentProviderProps {
  children: ReactNode;
}

export const CommentProvider: React.FC<CommentProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(commentReducer, initialState);

  const addComment = (comment: Comment) => {
    dispatch({ type: 'ADD_COMMENT', payload: comment });
  };

  const updateComment = (comment: Comment) => {
    dispatch({ type: 'UPDATE_COMMENT', payload: comment });
  };

  const deleteComment = (commentId: string) => {
    dispatch({ type: 'DELETE_COMMENT', payload: commentId });
  };

  const getCommentsByPostId = (postId: string) => {
    return state.comments.filter(comment => comment.postId === postId);
  };

  return (
    <CommentContext.Provider
      value={{
        state,
        dispatch,
        addComment,
        updateComment,
        deleteComment,
        getCommentsByPostId,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const useCommentContext = () => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useCommentContext must be used within a CommentProvider');
  }
  return context;
};