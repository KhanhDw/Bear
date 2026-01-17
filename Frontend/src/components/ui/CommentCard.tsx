import React from 'react';

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
    <div 
      className={`post-card ${isReply ? 'ml-10 mt-2 mb-2 border border-gray-200' : 'mt-2 mb-2'}`}
      style={{ maxWidth: isReply ? '500px' : '600px' }}
    >
      <div className="post-header">
        <div className="avatar">
          {authorName.charAt(0)}
        </div>
        <div>
          <div className="post-author">{authorName}</div>
          <div className="text-gray-500 text-sm">{createdAt}</div>
        </div>
        <button className="ml-auto text-gray-500 hover:text-gray-700">
          ⋮
        </button>
      </div>
      <div className="post-content">
        {content}
      </div>
      <div className="post-actions">
        <button 
          className="flex items-center text-gray-600 hover:text-red-600"
          onClick={onLike}
          aria-label="like"
        >
          ❤️
          <span className="ml-1">{likesCount} likes</span>
        </button>
        <button 
          className="flex items-center text-gray-600 hover:text-blue-600 ml-4"
          onClick={onReply}
          aria-label="reply"
        >
          ↪️ Reply
        </button>
      </div>
    </div>
  );
};

export default CommentCard;