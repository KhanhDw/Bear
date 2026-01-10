import React from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import {
  FavoriteBorder as LikeIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

interface PostCardProps {
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

const PostCard: React.FC<PostCardProps> = ({
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
    <Card sx={{ maxWidth: 600, margin: '16px auto', boxShadow: 3 }}>
      <CardHeader
        avatar={
          <Avatar src={authorAvatar} aria-label="author">
            {authorName.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreIcon />
          </IconButton>
        }
        title={authorName}
        subheader={createdAt}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </CardContent>
      {imageUrl && (
        <CardMedia
          component="img"
          height="300"
          image={imageUrl}
          alt="Post content"
        />
      )}
      <CardActions disableSpacing>
        <IconButton aria-label="like" onClick={onLike}>
          <LikeIcon />
        </IconButton>
        <IconButton aria-label="comment" onClick={onComment}>
          <CommentIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <Chip label={`${likesCount} likes`} size="small" />
        <Chip label={`${commentsCount} comments`} size="small" sx={{ ml: 1 }} />
      </CardActions>
    </Card>
  );
};

export default PostCard;