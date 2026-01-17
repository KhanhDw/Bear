import React from "react";

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
    <div className="post-card">
      <div className="post-header">
        <div className="avatar">
          {post_author_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="post-author">{post_author_name}</div>
          <div className="text-gray-500 text-sm">{post_created_at}</div>
        </div>
      </div>
      <div className="hidden">
        <p>{post_id}</p>
        <p>{post_author_id}</p>
      </div>
      <div className="post-content">
        {post_content}
      </div>
      <div className="post-actions">
        <button 
          className="flex items-center text-gray-600 hover:text-blue-600"
          onClick={onUpvote}
          aria-label="upvote"
        >
          👍
          <span className="ml-1">{upvotes}</span>
        </button>
        <button 
          className="flex items-center text-gray-600 hover:text-blue-600 ml-4"
          onClick={onDownvote}
          aria-label="downvote"
        >
          👎
          <span className="ml-1">{downvotes}</span>
        </button>
        <button 
          className="flex items-center text-gray-600 hover:text-blue-600 ml-4"
          onClick={onComment}
          aria-label="comment"
        >
          💬
          <span className="ml-1">{comments_count} comments</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;