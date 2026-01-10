import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import {
  FavoriteBorder as LikeIcon,
  Reply as ReplyIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

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
    <Card 
      sx={{ 
        maxWidth: isReply ? 500 : 600, 
        margin: isReply ? '8px 0 8px 40px' : '8px 0', 
        boxShadow: 1,
        border: isReply ? '1px solid #e0e0e0' : 'none'
      }}
    >
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
      <CardActions disableSpacing>
        <IconButton aria-label="like" onClick={onLike}>
          <LikeIcon />
        </IconButton>
        <IconButton aria-label="reply" onClick={onReply}>
          <ReplyIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="caption" color="text.secondary">
          {likesCount} likes
        </Typography>
      </CardActions>
    </Card>
  );
};

export default CommentCard;