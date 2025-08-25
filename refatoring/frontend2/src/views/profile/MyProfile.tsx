import { 
  Avatar, 
  Box, 
  Button, 
  Container,
  Divider, 
  FormControl, 
  Grid, 
  IconButton, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  TextField, 
  Typography, 
  useMediaQuery, 
  useTheme,
  Fade,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PanoramaHorizontalIcon from '@mui/icons-material/PanoramaHorizontal';
import { CommonApi, EActivityLocation, SelectOptionDto, UserApi } from "../../gen/api/src";
import ApiConfiguration from "../../config/apiConfig";
import { UserInfoResponseDto } from "../../gen/api/src/models/UserInfoResponseDto";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import BannerModal from "../../components/modals/BannerModal";

const MyProfile = () => {
  const userService = new UserApi(ApiConfiguration);
  const commonService = new CommonApi(ApiConfiguration);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openBannerModal, setOpenBannerModal] = useState(false);
  const [userInfos, setUserInfos] = useState<UserInfoResponseDto>({ 
    email: '', 
    nickname: '', 
    activityLocation: 1 
  });
  const [locations, setLocations] = useState<SelectOptionDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formUpdateRegister, setFormUpdateRegister] = useState({
    email: '',
    nickname: '',
    city: 0,
  });

  useEffect(() => {
    setFadeIn(true);
    loadUserInformation();
  }, []);

  const loadUserInformation = async () => {
    try {
      setLoading(true);
      const [userInfosResult, locationsResult] = await Promise.all([
        userService.apiUserGetUserInfoGet(),
        commonService.apiCommonGetDisplayCitiesGet()
      ]);

      if (userInfosResult.isSuccess) {
        setUserInfos(userInfosResult.data!);
        setFormUpdateRegister({ 
          email: userInfosResult.data!.email!, 
          nickname: userInfosResult.data!.nickname!, 
          city: userInfosResult.data!.activityLocation! 
        });
      }

      if (locationsResult.isSuccess) {
        setLocations(locationsResult.data!);
      }
    } catch (error) {
      console.error('Error loading user information:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (event: any) => {
    const selectedCityValue = event.target.value as number;
    setFormUpdateRegister({ ...formUpdateRegister, city: selectedCityValue });
  };

  const handleEditProfile = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setSelectedImage(null);
      setFile(null);
      setFormUpdateRegister({ 
        email: userInfos.email!, 
        nickname: userInfos.nickname!, 
        city: userInfos.activityLocation! 
      });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
      }

      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      const reader = new FileReader();
      setFile(selectedFile);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpdateChanges = async () => {
    if (!formUpdateRegister.email.trim() || !formUpdateRegister.nickname.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      const result = await userService.apiUserUpdateUserPost({
        email: formUpdateRegister.email,
        nickname: formUpdateRegister.nickname,
        activityLocation: formUpdateRegister.city as EActivityLocation,
        file: file ?? undefined
      });

      if (result.isSuccess) {
        // Reload user information
        await loadUserInformation();
        setIsEditing(false);
        setSelectedImage(null);
        setFile(null);
      } else {
        alert(`Erro: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      setLoading(true);
      await userService.apiUserGenerateTokenToResetPasswordPost({});
      setOpenPasswordDialog(false);
      alert('E-mail de redefinição enviado com sucesso!');
    } catch (error) {
      console.error('Error sending password reset:', error);
      alert('Erro ao enviar e-mail de redefinição');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocationName = () => {
    const location = locations.find(loc => loc.value === userInfos.activityLocation);
    return location?.name || 'Não informado';
  };

  return (
    <>
      <LoadingSpinner isLoading={loading} />
      
      <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
        <Fade in={fadeIn} timeout={800}>
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #d32f2f 0%, #ff6b6b 100%)',
                color: 'white',
                p: 4,
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <PersonIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography 
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                Meu Perfil
              </Typography>
              <Typography 
                variant="h6"
                sx={{ 
                  opacity: 0.9,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Gerencie suas informações pessoais
              </Typography>
            </Box>

            <Box sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
              <Grid container spacing={4}>
                {/* Avatar Section */}
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 3
                    }}
                  >
                    {/* Avatar */}
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        src={selectedImage || userInfos.profilePicture!}
                        sx={{
                          width: { xs: 150, sm: 180, md: 200 },
                          height: { xs: 150, sm: 180, md: 200 },
                          border: '4px solid',
                          borderColor: 'primary.light',
                          boxShadow: '0 8px 32px rgba(211, 47, 47, 0.3)',
                          fontSize: '4rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {!selectedImage && !userInfos.profilePicture && 
                          userInfos.nickname?.charAt(0)?.toUpperCase()
                        }
                      </Avatar>

                      {isEditing && (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="upload-image-input"
                          />
                          <IconButton
                            component="label"
                            htmlFor="upload-image-input"
                            sx={{
                              position: 'absolute',
                              bottom: 8,
                              right: 8,
                              bgcolor: 'primary.main',
                              color: 'white',
                              width: 48,
                              height: 48,
                              '&:hover': {
                                bgcolor: 'primary.dark',
                                transform: 'scale(1.1)'
                              },
                              boxShadow: '0 4px 16px rgba(211, 47, 47, 0.4)'
                            }}
                          >
                            <PhotoCameraIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>

                    {/* User Info */}
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {userInfos.nickname}
                      </Typography>
                      <Chip 
                        label={getCurrentLocationName()} 
                        color="primary" 
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                      {isEditing ? (
                        <>
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleUpdateChanges}
                            sx={{
                              background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #388e3c, #4caf50)'
                              }
                            }}
                          >
                            Salvar Alterações
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={handleEditProfile}
                          >
                            Cancelar Edição
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleEditProfile}
                            sx={{
                              background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #b71c1c, #f44336)'
                              }
                            }}
                          >
                            Editar Perfil
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<PanoramaHorizontalIcon />}
                            onClick={() => setOpenBannerModal(true)}
                            color="success"
                            sx={{
                              borderColor: 'success.main',
                              '&:hover': {
                                borderColor: 'success.dark',
                                backgroundColor: 'rgba(76, 175, 80, 0.04)'
                              }
                            }}
                          >
                            {userInfos.profileBanner ? 'Editar Banner' : 'Adicionar Banner'}
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                </Grid>

                {/* Form Section */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Email Field */}
                    <Box>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        E-mail
                      </Typography>
                      <TextField
                        value={isEditing ? formUpdateRegister.email : userInfos.email}
                        onChange={(e) => setFormUpdateRegister({ 
                          ...formUpdateRegister, 
                          email: e.target.value 
                        })}
                        disabled={!isEditing}
                        fullWidth
                        variant="outlined"
                        placeholder="seu@email.com"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Box>

                    {/* Nickname Field */}
                    <Box>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Apelido
                      </Typography>
                      <TextField
                        value={isEditing ? formUpdateRegister.nickname : userInfos.nickname}
                        onChange={(e) => setFormUpdateRegister({ 
                          ...formUpdateRegister, 
                          nickname: e.target.value 
                        })}
                        disabled={!isEditing}
                        fullWidth
                        variant="outlined"
                        placeholder="Seu apelido"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Box>

                    {/* City Field */}
                    <Box>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Cidade
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={isEditing ? formUpdateRegister.city : userInfos.activityLocation}
                          onChange={handleCityChange}
                          disabled={!isEditing}
                          sx={{
                            borderRadius: 2
                          }}
                        >
                          {locations.map((city) => (
                            <MenuItem key={city.value} value={city.value}>
                              {city.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    {/* Password Field */}
                    <Box>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Senha
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                          value="••••••••"
                          disabled
                          sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                        <Button
                          variant="outlined"
                          startIcon={<LockIcon />}
                          onClick={() => setOpenPasswordDialog(true)}
                          sx={{ minWidth: 'fit-content' }}
                        >
                          Alterar Senha
                        </Button>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Por segurança, a alteração de senha é feita via e-mail
                      </Typography>
                    </Box>

                    {/* File Info */}
                    {isEditing && file && (
                      <Box 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'rgba(211, 47, 47, 0.05)',
                          borderRadius: 2,
                          border: '1px solid rgba(211, 47, 47, 0.2)'
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          📁 Nova foto selecionada: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Fade>
      </Container>

      {/* Password Reset Dialog */}
      <Dialog 
        open={openPasswordDialog} 
        onClose={() => setOpenPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Alterar Senha</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Deseja enviar um e-mail para redefinição de senha?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Um link será enviado para o seu e-mail cadastrado para que você possa criar uma nova senha com segurança.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenPasswordDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handlePasswordReset}
            variant="contained"
            startIcon={<LockIcon />}
          >
            Enviar E-mail
          </Button>
        </DialogActions>
      </Dialog>

      {/* Banner Modal */}
      <BannerModal
        open={openBannerModal}
        onClose={() => setOpenBannerModal(false)}
        onSuccess={() => {
          loadUserInformation(); // Reload user info to get updated banner
        }}
      />
    </>
  );
};

export default MyProfile;
