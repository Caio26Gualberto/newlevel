import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';

interface DraggableBannerPositionProps {
  bannerFile: File | null;
  position: number;
  onPositionChange: (position: number) => void;
  disabled?: boolean;
}

const DraggableBannerPosition: React.FC<DraggableBannerPositionProps> = ({
  bannerFile,
  position,
  onPositionChange,
  disabled = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [dragging, setDragging] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const startYRef = useRef(0);
  const startPositionRef = useRef(position);

  // Generate preview URL when banner file changes
  React.useEffect(() => {
    if (bannerFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setBannerPreview(reader.result);
        }
      };
      reader.readAsDataURL(bannerFile);
    } else {
      setBannerPreview(null);
    }
    
    // Cleanup function to revoke object URL
    return () => {
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerFile]);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (disabled) return;
    setDragging(true);
    startYRef.current = event.clientY;
    startPositionRef.current = position;
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!dragging || disabled) return;
    const deltaY = event.clientY - startYRef.current;
    const newPosition = Math.max(0, Math.min(100, startPositionRef.current + deltaY * 0.2));
    onPositionChange(Math.floor(newPosition));
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    if (disabled) return;
    setDragging(true);
    startYRef.current = event.touches[0].clientY;
    startPositionRef.current = position;
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!dragging || disabled) return;
    const deltaY = event.touches[0].clientY - startYRef.current;
    const newPosition = Math.max(0, Math.min(100, startPositionRef.current + deltaY * 0.2));
    onPositionChange(Math.floor(newPosition));
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  if (!bannerFile) {
    return null;
  }

  // Show loading state while preview is being generated
  if (!bannerPreview) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 120, 
        border: '2px dashed',
        borderColor: 'primary.main',
        borderRadius: 2,
        bgcolor: 'rgba(211, 47, 47, 0.05)'
      }}>
        <Typography variant="body2" color="primary">
          Carregando preview do banner...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ width: '100%' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Box
        sx={{
          width: "100%",
          height: {
            xs: 120,
            sm: 150,
            md: 180
          },
          backgroundImage: `url(${bannerPreview})`,
          backgroundSize: "cover",
          backgroundPosition: `center ${position}%`,
          borderRadius: 2,
          cursor: disabled ? 'default' : (dragging ? "grabbing" : "grab"),
          border: `2px solid ${theme.palette.primary.main}`,
          transition: dragging ? 'none' : 'background-position 0.1s ease',
          position: 'relative',
          overflow: 'hidden',
          opacity: disabled ? 0.6 : 1,
          mb: 1
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      
      <Typography 
        variant="caption"
        sx={{
          fontSize: {
            xs: "0.7rem",
            sm: "0.75rem"
          },
          textAlign: "center",
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          display: 'block',
          mb: 0.5
        }}
      >
        Preview: altura real do banner no evento
      </Typography>
      
      <Typography 
        variant="body2"
        sx={{
          fontSize: {
            xs: "0.75rem",
            sm: "0.875rem"
          },
          textAlign: "center",
          color: theme.palette.text.secondary,
          fontStyle: 'italic'
        }}
      >
        {disabled 
          ? 'Posicionamento desabilitado durante o carregamento'
          : (isMobile 
              ? 'Toque e arraste para ajustar a posição do banner'
              : 'Clique e arraste para ajustar a posição do banner'
            )
        }
      </Typography>
      
      <Typography 
        variant="caption"
        sx={{
          fontSize: "0.7rem",
          textAlign: "center",
          color: theme.palette.text.secondary,
          display: 'block',
          mt: 1
        }}
      >
        Posição atual: {position}%
      </Typography>
    </Box>
  );
};

export default DraggableBannerPosition;