import React from 'react';
import { FaHeart, FaReply } from 'react-icons/fa';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import styles from './CommentCard.module.css';

interface CommentCardProps {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  likesCount: number;
  createdAt: string;
  isReply?: boolean;
  onLike?: () => void;
  onReply?: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  authorName,
  authorAvatar,
  content,
  likesCount,
  createdAt,
  isReply = false,
  onLike,
  onReply,
}) => {
  return (
    <div className={`${styles.commentCard} ${isReply ? styles.replyComment : ''}`}>
      <div className={styles.commentHeader}>
        <div className={styles.avatar}>
          {authorName && authorName.charAt(0).toUpperCase() || '?'}
        </div>
        <div>
          <div className={styles.commentAuthor}>{authorName || 'Unknown User'}</div>
          <div className={styles.commentTimestamp}>{createdAt}</div>
        </div>
        <button className={styles.moreOptions}>
          <BiDotsVerticalRounded />
        </button>
      </div>
      <div className={styles.commentContent}>
        {content}
      </div>
      <div className={styles.commentActions}>
        <button 
          className={styles.likeButton}
          onClick={onLike}
          aria-label="like"
        >
          <FaHeart />
          <span className={styles.count}>{likesCount} likes</span>
        </button>
        <button 
          className={styles.replyButton}
          onClick={onReply}
          aria-label="reply"
        >
          <FaReply />
          <span className={styles.replyText}>Reply</span>
        </button>
      </div>
    </div>
  );
};

export default CommentCard;