import React from 'react';
import PostCard from './PostCard';

interface FeedItemProps {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  onLike?: () => void;
  onComment?: () => void;
}

const FeedItem: React.FC<FeedItemProps> = ({
  id,
  authorName,
  authorAvatar,
  content,
  imageUrl,
  likesCount,
  commentsCount,
  createdAt,
  onLike,
  onComment,
}) => {
  return (
    <PostCard
      id={id}
      authorName={authorName}
      authorAvatar={authorAvatar}
      content={content}
      imageUrl={imageUrl}
      likesCount={likesCount}
      commentsCount={commentsCount}
      createdAt={createdAt}
      onLike={onLike}
      onComment={onComment}
    />
  );
};

export default FeedItem;