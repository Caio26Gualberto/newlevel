import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

interface LoadingSpinnerProps {
  isLoading: boolean;
  message?: string;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  isLoading, 
  message = 'Carregando...', 
  size = 40 
}) => {
  if (!isLoading) return null;

  return (
    <Fade in={isLoading}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <CircularProgress 
          size={size} 
          sx={{ 
            color: 'primary.main',
            mb: 2
          }} 
        />
        <Typography 
          variant="h6" 
          color="white"
          sx={{ 
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          {message}
        </Typography>
      </Box>
    </Fade>
  );
};

export default LoadingSpinner;
