import React from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Typography,
  Box,
} from '@mui/material';
import {
  Chat as MessageIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

interface UserProfileCardProps {
  name: string;
  username: string;
  bio: string;
  profilePictureUrl: string;
  coverImageUrl?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  onFollow?: () => void;
  onMessage?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name,
  username,
  bio,
  profilePictureUrl,
  coverImageUrl,
  postsCount,
  followersCount,
  followingCount,
  onFollow,
  onMessage,
}) => {
  return (
    <Card sx={{ maxWidth: 600, margin: '16px auto', boxShadow: 3 }}>
      {coverImageUrl && (
        <CardMedia
          component="img"
          height="150"
          image={coverImageUrl}
          alt="Cover"
        />
      )}
      <CardHeader
        avatar={
          <Avatar src={profilePictureUrl} sx={{ width: 96, height: 96, border: '4px solid white', marginTop: -6 }} aria-label="profile">
            {name.charAt(0)}
          </Avatar>
        }
        action={
          <Button variant="contained" onClick={onFollow}>
            Follow
          </Button>
        }
        title={name}
        subheader={`@${username}`}
      />
      <CardContent>
        <Typography variant="body1" color="text.secondary" paragraph>
          {bio}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="body2">
            <strong>{postsCount}</strong> Posts
          </Typography>
          <Typography variant="body2">
            <strong>{followersCount}</strong> Followers
          </Typography>
          <Typography variant="body2">
            <strong>{followingCount}</strong> Following
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button startIcon={<MessageIcon />} onClick={onMessage}>
          Message
        </Button>
        <Button startIcon={<MoreIcon />}>
          More
        </Button>
      </CardActions>
    </Card>
  );
};

export default UserProfileCard;