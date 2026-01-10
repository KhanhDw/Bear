import React from 'react';
import {
  IconButton,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Favorite as LikeIcon,
  FavoriteBorder as LikeBorderIcon,
  ArrowUpward as UpvoteIcon,
  ArrowDownward as DownvoteIcon,
} from '@mui/icons-material';

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
  const handleVoteChange = (_event: React.MouseEvent<HTMLElement>, newVote: 'up' | 'down' | null) => {
    if (userVote === newVote) {
      // If clicking the same vote, remove the vote (set to null)
      onVote(null);
    } else {
      onVote(newVote);
    }
  };

  if (variant === 'like') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton 
          color={userVote === 'up' ? 'error' : 'default'} 
          onClick={() => onVote(userVote === 'up' ? null : 'up')}
        >
          {userVote === 'up' ? <LikeIcon /> : <LikeBorderIcon />}
        </IconButton>
        <Typography variant="body2">{upvotes}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <ToggleButtonGroup
        value={userVote}
        exclusive
        onChange={handleVoteChange}
        aria-label="vote"
      >
        <ToggleButton 
          value="up" 
          aria-label="upvote"
          sx={{
            border: 'none',
            minWidth: 'auto',
            color: userVote === 'up' ? 'success.main' : 'inherit'
          }}
        >
          <UpvoteIcon />
        </ToggleButton>
        <Typography variant="body2" sx={{ mx: 1 }}>
          {upvotes - downvotes}
        </Typography>
        <ToggleButton 
          value="down" 
          aria-label="downvote"
          sx={{
            border: 'none',
            minWidth: 'auto',
            color: userVote === 'down' ? 'error.main' : 'inherit'
          }}
        >
          <DownvoteIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default VoteButtons;