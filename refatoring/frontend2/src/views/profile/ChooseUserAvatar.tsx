import { 
  Avatar, 
  Box, 
  Container, 
  Typography, 
  useTheme, 
  useMediaQuery,
  Button,
  Paper,
  Fade,
  IconButton
} from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { UserApi } from "../../gen/api/src";
import ApiConfiguration from "../../config/apiConfig";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const ChooseUserAvatar = () => {
  const userService = new UserApi(ApiConfiguration);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    setLoading(true);
    try {
      if (selectedImage) {
        const result = await userService.apiUserUploadAvatarImagePost({
          file: selectedImage
        });

        if (result.isSuccess) {
          // Success notification would go here
          console.log('Avatar uploaded successfully');
        } else {
          console.error('Failed to upload avatar');
        }
      }
      navigate('/presentation');
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/presentation');
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = () => {
    // Get user initials from localStorage or default to 'U'
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.name ? user.name.charAt(0).toUpperCase() : 'U';
      } catch {
        return 'U';
      }
    }
    return 'U';
  };

  return (
    <>
      <LoadingSpinner isLoading={loading} />
      <Container 
        maxWidth="md" 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 4
        }}
      >
        <Fade in={fadeIn} timeout={800}>
          <Paper
            elevation={8}
            sx={{
              width: '100%',
              p: { xs: 3, sm: 4, md: 6 },
              borderRadius: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                Escolha seu Avatar
              </Typography>
              
              <Typography 
                variant="h6"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                Personalize seu perfil com uma foto. Você pode alterar depois! 😊
              </Typography>
            </Box>

            {/* Avatar Section */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  mb: 3
                }}
              >
                <Avatar
                  src={imageSrc || undefined}
                  sx={{
                    width: { xs: 180, sm: 220, md: 260 },
                    height: { xs: 180, sm: 220, md: 260 },
                    fontSize: { xs: '4rem', sm: '5rem', md: '6rem' },
                    fontWeight: 'bold',
                    bgcolor: imageSrc ? 'transparent' : 'primary.main',
                    border: '4px solid',
                    borderColor: imageSrc ? 'transparent' : 'primary.light',
                    boxShadow: '0 8px 32px rgba(211, 47, 47, 0.3)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 12px 40px rgba(211, 47, 47, 0.4)'
                    }
                  }}
                  onClick={handleButtonClick}
                >
                  {!imageSrc && getInitials()}
                </Avatar>

                {/* Camera Icon Overlay */}
                <IconButton
                  onClick={handleButtonClick}
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: 'primary.main',
                    color: 'white',
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'scale(1.1)'
                    },
                    boxShadow: '0 4px 16px rgba(211, 47, 47, 0.4)'
                  }}
                >
                  <PhotoCameraIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                </IconButton>

                {/* Remove Button */}
                {imageSrc && (
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'error.main',
                      color: 'white',
                      width: 40,
                      height: 40,
                      '&:hover': {
                        bgcolor: 'error.dark',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <CloseIcon sx={{ fontSize: '1.2rem' }} />
                  </IconButton>
                )}
              </Box>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageChange}
              />

              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Clique na imagem ou no ícone da câmera para selecionar uma foto
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box 
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Button
                variant="outlined"
                onClick={handleSkip}
                sx={{
                  minWidth: { xs: '100%', sm: 160 },
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                Pular por agora
              </Button>

              <Button
                variant="contained"
                onClick={handleSaveAvatar}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  minWidth: { xs: '100%', sm: 160 },
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #b71c1c, #f44336)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(211, 47, 47, 0.4)'
                  }
                }}
              >
                {selectedImage ? 'Salvar Avatar' : 'Continuar'}
              </Button>
            </Box>

            {/* File Info */}
            {selectedImage && (
              <Box 
                sx={{ 
                  mt: 3, 
                  p: 2, 
                  bgcolor: 'rgba(211, 47, 47, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(211, 47, 47, 0.2)'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  📁 {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              </Box>
            )}
          </Paper>
        </Fade>
      </Container>
    </>
  );
};

export default ChooseUserAvatar;
