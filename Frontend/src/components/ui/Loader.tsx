import React from 'react';
import { CircularProgress, Box } from '@mui/material';

interface LoaderProps {
  size?: number;
  thickness?: number;
}

const Loader: React.FC<LoaderProps> = ({ size = 40, thickness = 4 }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
      <CircularProgress size={size} thickness={thickness} />
    </Box>
  );
};

export default Loader;