import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import {
  ThumbUp as UpVoteIcon,
  ThumbDown as DownVoteIcon,
  ChatBubbleOutline as CommentIcon,
} from "@mui/icons-material";

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
    <Card
      sx={{ margin: "16px auto", boxShadow: 3 }}
      className="w-120"
    >
      <CardHeader
        avatar={<Avatar>{post_author_name.charAt(0).toUpperCase()}</Avatar>}
        title={post_author_name}
        subheader={post_created_at}
      />
      <div className="hidden">
        <p>{post_id}</p>
        <p>{post_author_id}</p>
      </div>
      <CardContent>
        <Typography
          variant="body2"
          color="text.primary"
        >
          {post_content}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton
          aria-label="upvote"
          onClick={onUpvote}
        >
          <UpVoteIcon />
        </IconButton>
        <Typography
          variant="caption"
          sx={{ mr: 1 }}
        >
          {upvotes}
        </Typography>
        <IconButton
          aria-label="downvote"
          onClick={onDownvote}
        >
          <DownVoteIcon />
        </IconButton>
        <Typography
          variant="caption"
          sx={{ mr: 2 }}
        >
          {downvotes}
        </Typography>
        <IconButton
          aria-label="comment"
          onClick={onComment}
        >
          <CommentIcon />
        </IconButton>
        <Typography variant="caption">{comments_count} comments</Typography>
      </CardActions>
    </Card>
  );
};

export default PostCard;
