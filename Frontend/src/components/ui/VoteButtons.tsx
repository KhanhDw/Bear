import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import styles from './VoteButtons.module.css';

interface VoteButtonsProps {
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null; // null means no vote
  onVote: (voteType: 'up' | 'down' | null) => void;
  variant?: 'like' | 'updown';
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  upvotes,
  downvotes,
  userVote = null,
  onVote,
  variant = 'like'
}) => {
  const handleUpvote = () => {
    if (userVote === 'up') {
      // If clicking the same vote, remove the vote (set to null)
      onVote(null);
    } else {
      onVote('up');
    }
  };

  const handleDownvote = () => {
    if (userVote === 'down') {
      // If clicking the same vote, remove the vote (set to null)
      onVote(null);
    } else {
      onVote('down');
    }
  };

  if (variant === 'like') {
    return (
      <div className={styles.voteContainer}>
        <button 
          className={`${styles.voteButton} ${userVote === 'up' ? styles.activeUpvote : ''}`}
          onClick={handleUpvote}
          aria-label="like"
        >
          <FaThumbsUp />
        </button>
        <span className={styles.voteCount}>{upvotes}</span>
      </div>
    );
  }

  return (
    <div className={styles.voteContainer}>
      <button 
        className={`${styles.voteButton} ${styles.upvoteButton} ${userVote === 'up' ? styles.activeUpvote : ''}`}
        onClick={handleUpvote}
        aria-label="upvote"
      >
        <FaThumbsUp />
      </button>
      <span className={styles.voteCount}>{upvotes - downvotes}</span>
      <button 
        className={`${styles.voteButton} ${styles.downvoteButton} ${userVote === 'down' ? styles.activeDownvote : ''}`}
        onClick={handleDownvote}
        aria-label="downvote"
      >
        <FaThumbsDown />
      </button>
    </div>
  );
};

export default VoteButtons;