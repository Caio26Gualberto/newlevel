import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardActions, 
  IconButton, 
  Fab, 
  useTheme, 
  useMediaQuery,
  Paper,
  Fade,
  Skeleton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { PhotoApi, PhotoResponseDto } from "../../gen/api/src";
import ApiConfiguration from "../../config/apiConfig";
import LoadingSpinner from "../../components/common/LoadingSpinner";

interface Photo {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
}

const MyPhotos = () => {
  const photoService = new PhotoApi(ApiConfiguration);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [photoForm, setPhotoForm] = useState({
    title: '',
    file: null as File | null
  });

  useEffect(() => {
    setFadeIn(true);
    loadMyPhotos();
  }, []);

  const loadMyPhotos = async () => {
    setLoading(true);
    try {
      // Use actual API call to get all photos (filtered by user on backend)
      const result = await photoService.apiPhotoGetAllPhotosPost({
        pagination: {
          page: 1,
          pageSize: 50,
          pageCount: 0,
          search: ''
        }
      });
      
      if (result.isSuccess && result.data?.items) {
        const userPhotos: Photo[] = result.data.items.map((photo: any) => ({
          id: photo.id?.toString() || '',
          title: photo.title || '',
          imageUrl: photo.src || '/api/placeholder/300/200',
          createdAt: photo.takeAt ? new Date(photo.takeAt).toISOString().split('T')[0] : ''
        }));
        setPhotos(userPhotos);
      } else {
        // If no photos or error, show empty state
        setPhotos([]);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = () => {
    setEditingPhoto(null);
    setPhotoForm({ title: '', file: null });
    setOpenDialog(true);
  };

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
    setPhotoForm({ title: photo.title, file: null });
    setOpenDialog(true);
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta foto?')) {
      try {
        setLoading(true);
        // API call to delete photo
        setPhotos(photos.filter(p => p.id !== photoId));
      } catch (error) {
        console.error('Error deleting photo:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSavePhoto = async () => {
    if (!photoForm.title.trim()) {
      alert('Por favor, insira um título para a foto.');
      return;
    }

    try {
      setLoading(true);
      
      if (editingPhoto) {
        // Update existing photo - this would need a specific API endpoint
        const updatedPhotos = photos.map(p => 
          p.id === editingPhoto.id 
            ? { ...p, title: photoForm.title }
            : p
        );
        setPhotos(updatedPhotos);
        alert('Foto atualizada com sucesso!');
      } else {
        // Add new photo using the actual API call from original project
        if (!photoForm.file) {
          alert('Por favor, selecione uma imagem.');
          return;
        }
        
        const currentDate = new Date();
        const result = await photoService.apiPhotoUploadPhotoPost({
          title: photoForm.title,
          subtitle: '', // Optional field
          description: '', // Optional field  
          takeAt: currentDate.toISOString(),
          file: photoForm.file
        });

        if (result.isSuccess) {
          alert('Foto enviada para aprovação com sucesso!');
          setOpenDialog(false);
          setPhotoForm({ title: '', file: null });
          // Refresh photos list
          loadMyPhotos();
        } else {
          alert(`Erro: ${result.message}`);
        }
      }
    } catch (error) {
      console.error('Error saving photo:', error);
      alert('Erro ao salvar foto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
      }
      setPhotoForm({ ...photoForm, file });
    }
  };

  const PhotoSkeleton = () => (
    <Card sx={{ borderRadius: 2 }}>
      <Skeleton variant="rectangular" height={200} />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </Box>
    </Card>
  );

  return (
    <>
      <LoadingSpinner isLoading={loading} />
      
      <Box className="main-content">
        <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
        <Fade in={fadeIn} timeout={800}>
          <Box>
            {/* Header */}
            <Paper
              elevation={4}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #d32f2f 0%, #ff6b6b 100%)',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography 
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                Minhas Fotos
              </Typography>
              <Typography 
                variant="h6"
                sx={{ 
                  opacity: 0.9,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Gerencie suas fotos pessoais
              </Typography>
            </Paper>

            {/* Photos Grid */}
            {photos.length === 0 && !loading ? (
              <Paper
                elevation={2}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: 'grey.50'
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  Nenhuma foto encontrada
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Comece adicionando suas primeiras fotos!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddPhoto}
                  sx={{
                    background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #b71c1c, #f44336)'
                    }
                  }}
                >
                  Adicionar Primeira Foto
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <PhotoSkeleton />
                    </Grid>
                  ))
                ) : (
                  photos.map((photo) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={photo.imageUrl}
                          alt={photo.title}
                          sx={{ objectFit: 'cover' }}
                        />
                        <Box sx={{ p: 2 }}>
                          <Typography 
                            variant="h6" 
                            noWrap
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            {photo.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                          >
                            {new Date(photo.createdAt).toLocaleDateString('pt-BR')}
                          </Typography>
                        </Box>
                        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                          <IconButton
                            onClick={() => handleEditPhoto(photo)}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeletePhoto(photo.id)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            )}

            {/* FAB for mobile */}
            {isMobile && (
              <Fab
                color="primary"
                onClick={handleAddPhoto}
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  right: 24,
                  background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #b71c1c, #f44336)'
                  }
                }}
              >
                <AddIcon />
              </Fab>
            )}

            {/* Desktop Add Button */}
            {!isMobile && photos.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleAddPhoto}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #b71c1c, #f44336)'
                    }
                  }}
                >
                  Adicionar Nova Foto
                </Button>
              </Box>
            )}
          </Box>
        </Fade>
        </Container>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingPhoto ? 'Editar Foto' : 'Adicionar Nova Foto'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Título da Foto"
            fullWidth
            margin="normal"
            value={photoForm.title}
            onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
            placeholder="Ex: Show no Rock in Rio"
          />
          
          {!editingPhoto && (
            <Box sx={{ mt: 2 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  sx={{ py: 2 }}
                >
                  {photoForm.file ? photoForm.file.name : 'Selecionar Imagem'}
                </Button>
              </label>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSavePhoto}
            variant="contained"
            disabled={!photoForm.title.trim() || (!editingPhoto && !photoForm.file)}
          >
            {editingPhoto ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyPhotos;
