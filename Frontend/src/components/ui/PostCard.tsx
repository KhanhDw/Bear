import React from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { BiComment } from "react-icons/bi";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post_id: string;
  post_content: string;
  post_author_id: string;
  post_author_name: string;
  post_created_at: string;
  upvotes: number;
  downvotes: number;
  comments_count: number;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onComment?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post_id,
  post_content,
  post_author_id,
  post_author_name,
  post_created_at,
  upvotes,
  downvotes,
  comments_count,
  onUpvote,
  onDownvote,
  onComment,
}) => {
  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <div className={styles.avatar}>
          {post_author_name && post_author_name.charAt(0).toUpperCase() || '?'}
        </div>
        <div>
          <div className={styles.postAuthor}>{post_author_name || 'Unknown User'}</div>
          <div className={styles.postTimestamp}>{post_created_at}</div>
        </div>
      </div>
      <div className={styles.hidden}>
        <p>{post_id}</p>
        <p>{post_author_id}</p>
      </div>
      <div className={styles.postContent}>
        {post_content}
      </div>
      <div className={styles.postActions}>
        <button 
          className={styles.upvoteButton}
          onClick={onUpvote}
          aria-label="upvote"
        >
          <FaThumbsUp />
          <span className={styles.count}>{upvotes}</span>
        </button>
        <button 
          className={styles.downvoteButton}
          onClick={onDownvote}
          aria-label="downvote"
        >
          <FaThumbsDown />
          <span className={styles.count}>{downvotes}</span>
        </button>
        <button 
          className={styles.commentButton}
          onClick={onComment}
          aria-label="comment"
        >
          <BiComment />
          <span className={styles.count}>{comments_count} comments</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;