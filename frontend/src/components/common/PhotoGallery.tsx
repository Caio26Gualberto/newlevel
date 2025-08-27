import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Paper,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Photo as PhotoIcon
} from '@mui/icons-material';
import { PhotoResponseDto } from '../../gen/api/src/models/PhotoResponseDto';

interface PhotoGalleryProps {
  photos: PhotoResponseDto[];
  maxVisible?: number;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, maxVisible = 6 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (!photos || photos.length === 0) {
    return (
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: 'grey.50'
        }}
      >
        <PhotoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Nenhuma foto disponível
        </Typography>
      </Paper>
    );
  }

  const visiblePhotos = photos.slice(0, maxVisible);
  const remainingCount = photos.length - maxVisible;

  const handlePhotoClick = (index: number) => {
    setSelectedPhoto(index);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPhoto(null);
  };

  const handlePrevPhoto = () => {
    if (selectedPhoto !== null && selectedPhoto > 0) {
      setSelectedPhoto(selectedPhoto - 1);
    }
  };

  const handleNextPhoto = () => {
    if (selectedPhoto !== null && selectedPhoto < photos.length - 1) {
      setSelectedPhoto(selectedPhoto + 1);
    }
  };

  const getGridSize = () => {
    const photoCount = Math.min(photos.length, maxVisible);
    if (photoCount === 1) return { xs: 12 };
    if (photoCount === 2) return { xs: 6 };
    if (photoCount <= 4) return { xs: 6, sm: 6 };
    return { xs: 6, sm: 4 };
  };

  const gridSize = getGridSize();

  return (
    <>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        {visiblePhotos.map((photo, index) => (
          <Grid item {...gridSize} key={photo.id || index}>
            <Box
              onClick={() => handlePhotoClick(index)}
              sx={{
                position: 'relative',
                paddingBottom: '75%', // 4:3 aspect ratio
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: photo.src 
                    ? `url(${photo.src}) center/cover`
                    : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                  backgroundColor: 'grey.200'
                }}
              >
                {!photo.src && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'text.secondary'
                    }}
                  >
                    <PhotoIcon sx={{ fontSize: 32 }} />
                  </Box>
                )}
                
                {/* Show "+X more" overlay on the last visible photo if there are more photos */}
                {index === maxVisible - 1 && remainingCount > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)'
                      }
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      fontWeight="bold"
                      sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
                    >
                      +{remainingCount}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Photo Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', bgcolor: 'black' }}>
          {/* Close Button */}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Navigation Buttons */}
          {photos.length > 1 && selectedPhoto !== null && (
            <>
              <IconButton
                onClick={handlePrevPhoto}
                disabled={selectedPhoto === 0}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1000,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)'
                  },
                  '&:disabled': {
                    color: 'grey.500'
                  }
                }}
              >
                <ChevronLeftIcon />
              </IconButton>

              <IconButton
                onClick={handleNextPhoto}
                disabled={selectedPhoto === photos.length - 1}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1000,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)'
                  },
                  '&:disabled': {
                    color: 'grey.500'
                  }
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </>
          )}

          {/* Photo Display */}
          {selectedPhoto !== null && photos[selectedPhoto] && (
            <Fade in timeout={300}>
              <Box
                sx={{
                  width: '100%',
                  height: isMobile ? '100vh' : '80vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={photos[selectedPhoto].src || ''}
                    alt={photos[selectedPhoto].title || 'Foto'}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </Box>

                {/* Photo Info */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                    color: 'white',
                    p: 3
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {photos[selectedPhoto].title}
                    </Typography>
                    {photos[selectedPhoto].subtitle && (
                      <Typography variant="body2" color="grey.300">
                        {photos[selectedPhoto].subtitle}
                      </Typography>
                    )}
                    <Typography variant="caption" color="grey.400">
                      {selectedPhoto + 1} de {photos.length} fotos
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </Fade>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoGallery;
