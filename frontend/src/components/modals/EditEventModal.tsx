import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  InputAdornment,
  Stack,
  IconButton,
  Card,
  CardMedia,
  CircularProgress,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { EEventStatus, EventDto } from '../../types/Event';
import * as toastr from 'toastr';
import { CommonApi, EventApi, SelectOptionDto, EventResponseDto } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';
import DraggableBannerPosition from '../common/DraggableBannerPosition';

interface EditEventModalProps {
  open: boolean;
  onClose: () => void;
  eventId: number;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ open, onClose, eventId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [bannerPosition, setBannerPosition] = useState<number>(50);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [photosToDelete, setPhotosToDelete] = useState<number[]>([]);
  const [musicGenres, setMusicGenres] = useState<SelectOptionDto[]>([]);
  const [eventData, setEventData] = useState<EventResponseDto | null>(null);
  const [form, setForm] = useState<Partial<EventDto>>({
    title: '',
    description: '',
    dateStart: '',
    dateEnd: '',
    location: '',
    ticketsLink: '',
    price: undefined,
    capacity: undefined,
    genre: [],
    eventStatus: EEventStatus.Draft,
  });

  const handleInputChange = (field: keyof EventDto) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setForm(prev => ({ 
      ...prev, 
      [field]: field === 'price' || field === 'capacity' 
        ? value === '' ? undefined : Number(value)
        : value 
    }));
  };

  const handleGenreChange = (event: any) => {
    const value = event.target.value;
    setForm(prev => ({ 
      ...prev, 
      genre: typeof value === 'string' ? value.split(',').map(Number) : value 
    }));
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toastr.error('Arquivo muito grande. Máximo 5MB.', 'Erro!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: "toast-bottom-right"
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toastr.error('Por favor, selecione apenas arquivos de imagem.', 'Erro!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: "toast-bottom-right"
        });
        return;
      }

      setSelectedBanner(file);
    }
  };

  const handlePhotosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (selectedPhotos.length + files.length > 10) {
      toastr.error('Máximo de 10 fotos permitidas.', 'Erro!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: "toast-bottom-right"
      });
      return;
    }

    // Validate file sizes
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toastr.error('Algumas fotos são muito grandes. Máximo 5MB por foto.', 'Erro!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: "toast-bottom-right"
      });
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidTypes = files.filter(file => !validTypes.includes(file.type));
    if (invalidTypes.length > 0) {
      toastr.error('Apenas imagens são permitidas (JPG, PNG, GIF, WebP).', 'Erro!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: "toast-bottom-right"
      });
      return;
    }

    setSelectedPhotos(prev => [...prev, ...files]);
    // Clear the input so the same files can be selected again if needed
    event.target.value = '';
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (photoId: number) => {
    setPhotosToDelete(prev => [...prev, photoId]);
  };

  const getPhotoPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const fetchEventData = async () => {
    if (!eventId) return;
    
    try {
      setLoadingEvent(true);
      const eventApi = new EventApi(ApiConfiguration);
      const result = await eventApi.apiEventGet({ eventId });
      
      if (result.isSuccess && result.data) {
        const event = result.data;
        setEventData(event);
        
        // Populate form with existing data
        setForm({
          title: event.title || '',
          description: event.description || '',
          dateStart: event.dateStart ? new Date(event.dateStart).toISOString().slice(0, 16) : '',
          dateEnd: event.dateEnd ? new Date(event.dateEnd).toISOString().slice(0, 16) : '',
          location: event.location || '',
          ticketsLink: event.ticketsLink || '',
          price: event.price || undefined,
          capacity: event.capacity || undefined,
          genre: event.genre || [],
          eventStatus: event.eventStatus || EEventStatus.Draft,
        });
        
        setBannerPosition(event.bannerPosition || 50);
      } else {
        toastr.error('Erro ao carregar dados do evento.', 'Erro!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: "toast-bottom-right"
        });
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toastr.error('Erro ao carregar evento. Tente novamente.', 'Erro!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: "toast-bottom-right"
      });
    } finally {
      setLoadingEvent(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title?.trim()) {
      toastr.error('Por favor, insira um título para o evento.', 'Erro!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: "toast-bottom-right"
      });
      return;
    }
    
    if (!form.dateStart) {
      toastr.error('Por favor, insira a data de início do evento.', 'Erro!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: "toast-bottom-right"
      });
      return;
    }

    if (!form.location?.trim()) {
      toastr.error('Por favor, insira o local do evento.', 'Erro!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: "toast-bottom-right"
      });
      return;
    }

    if (!form.genre || form.genre.length === 0) {
      toastr.error('Por favor, selecione pelo menos um gênero.', 'Erro!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: "toast-bottom-right"
      });
      return;
    }

    try {
      setLoading(true);
      const eventApi = new EventApi(ApiConfiguration);
      const result = await eventApi.apiEventUpdateEventPut({
        eventId: eventId,
        title: form.title,
        description: form.description,
        startTime: new Date(form.dateStart),
        endTime: form.dateEnd ? new Date(form.dateEnd) : undefined,
        location: form.location,
        ticketLink: form.ticketsLink,
        price: form.price,
        capacity: form.capacity,
        genres: form.genre,
        banner: selectedBanner ?? undefined,
        bannerPosition: selectedBanner ? bannerPosition : (eventData?.bannerPosition ?? undefined),
        photos: selectedPhotos,
        photosToDeleteId: photosToDelete.length > 0 ? photosToDelete : undefined,
      });
      
      if (result.isSuccess) {
        toastr.success('Evento atualizado com sucesso!', 'Sucesso!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: "toast-bottom-right"
        });
        resetForm();
        onClose();
      } else {
        toastr.error(result.message || 'Erro ao atualizar evento.', 'Erro!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: "toast-bottom-right"
        });
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toastr.error('Erro ao atualizar evento. Tente novamente.', 'Erro!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: "toast-bottom-right"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      dateStart: '',
      dateEnd: '',
      location: '',
      ticketsLink: '',
      price: undefined,
      capacity: undefined,
      genre: [],
      eventStatus: EEventStatus.Draft,
    });
    setSelectedBanner(null);
    setBannerPosition(50);
    setSelectedPhotos([]);
    setPhotosToDelete([]);
    setEventData(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get current date in YYYY-MM-DDTHH:MM format for min attribute
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchMusicGenres = async () => {
      try {
        const commonService = new CommonApi(ApiConfiguration);
        const musicGenres = (await commonService.apiCommonGetDisplayMusicGenresGet()).data;
        setMusicGenres(musicGenres!);
      } catch (error) {
        console.error("Erro ao buscar gêneros musicais:", error);
      }
    };
    fetchMusicGenres();
  }, []);

  useEffect(() => {
    if (open && eventId) {
      fetchEventData();
    }
  }, [open, eventId]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <EventIcon color="primary" />
          <Typography variant="h5" fontWeight="bold">
            Editar Evento
          </Typography>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        {loadingEvent ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Carregando dados do evento...</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {/* Basic Information */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                Informações Básicas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    label="Título do Evento"
                    fullWidth
                    value={form.title || ''}
                    onChange={handleInputChange('title')}
                    placeholder="Ex: Rock Festival 2024"
                    disabled={loading}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Descrição"
                    fullWidth
                    multiline
                    rows={3}
                    value={form.description || ''}
                    onChange={handleInputChange('description')}
                    placeholder="Descreva seu evento..."
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Local do Evento"
                    fullWidth
                    value={form.location || ''}
                    onChange={handleInputChange('location')}
                    placeholder="Ex: Estádio Municipal - São Paulo, SP"
                    disabled={loading}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Date and Time */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                Data e Horário
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Data e Hora de Início"
                    type="datetime-local"
                    fullWidth
                    value={form.dateStart || ''}
                    onChange={handleInputChange('dateStart')}
                    disabled={loading}
                    required
                    inputProps={{
                      min: getCurrentDateTime()
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Data e Hora de Fim (Opcional)"
                    type="datetime-local"
                    fullWidth
                    value={form.dateEnd || ''}
                    onChange={handleInputChange('dateEnd')}
                    disabled={loading}
                    inputProps={{
                      min: form.dateStart || getCurrentDateTime()
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Event Details */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                Detalhes do Evento
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Preço do Ingresso (R$)"
                    type="number"
                    fullWidth
                    value={form.price || ''}
                    onChange={handleInputChange('price')}
                    placeholder="0.00"
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Capacidade (Pessoas)"
                    type="number"
                    fullWidth
                    value={form.capacity || ''}
                    onChange={handleInputChange('capacity')}
                    placeholder="1000"
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PeopleIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Link para Ingressos"
                    fullWidth
                    value={form.ticketsLink || ''}
                    onChange={handleInputChange('ticketsLink')}
                    placeholder="https://tickets.com/meu-evento"
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth disabled={loading}>
                    <InputLabel>Gêneros Musicais</InputLabel>
                    <Select
                      required
                      multiple
                      value={form.genre || []}
                      onChange={handleGenreChange}
                      input={<OutlinedInput label="Gêneros Musicais" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as number[]).map((value) => {
                            const genre = musicGenres.find(g => g.value === value);
                            return (
                              <Chip 
                                key={value} 
                                label={genre?.name || value} 
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {musicGenres.map((genre) => (
                        <MenuItem key={genre.value} value={genre.value}>
                          {genre.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Banner Upload */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                Banner do Evento
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Current Banner */}
                {eventData?.bannerUrl && !selectedBanner && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Banner atual:
                    </Typography>
                    <Card elevation={2} sx={{ maxWidth: 400 }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={eventData.bannerUrl || ''}
                        alt="Banner atual"
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                  </Box>
                )}
                
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    style={{ display: 'none' }}
                    id="banner-upload"
                    disabled={loading}
                  />
                  <label htmlFor="banner-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      disabled={loading}
                      startIcon={<ImageIcon />}
                      sx={{ mb: 1 }}
                    >
                      {selectedBanner ? 'Trocar Banner' : eventData?.bannerUrl ? 'Alterar Banner' : 'Selecionar Banner'}
                    </Button>
                  </label>
                  {selectedBanner && (
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {selectedBanner.name}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" display="block">
                    Recomendado: 1200x600px, máximo 5MB
                  </Typography>
                </Box>

                {selectedBanner && (
                  <Box>
                    <Typography variant="h6" gutterBottom color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                      Posição do Banner
                    </Typography>
                    <DraggableBannerPosition
                      bannerFile={selectedBanner}
                      position={bannerPosition}
                      onPositionChange={setBannerPosition}
                      disabled={loading}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            {/* Photos Gallery */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                Fotos do Evento
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Adicione até 10 fotos do evento. Máximo 5MB por foto.
              </Typography>
              
              {/* Existing Photos */}
              {eventData?.photos && eventData.photos.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Fotos atuais:
                  </Typography>
                  <Grid container spacing={2}>
                    {eventData.photos
                      .filter(photo => !photosToDelete.includes(photo.id!))
                      .map((photo) => (
                      <Grid item xs={6} sm={4} md={3} key={photo.id}>
                        <Card 
                          elevation={2}
                          sx={{ 
                            position: 'relative',
                            borderRadius: 2,
                            overflow: 'hidden'
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="120"
                            image={photo.src || ''}
                            alt={photo.title || 'Foto do evento'}
                            sx={{ objectFit: 'cover' }}
                          />
                          
                          {/* Delete Button */}
                          <IconButton
                            onClick={() => removeExistingPhoto(photo.id!)}
                            disabled={loading}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'rgba(0, 0, 0, 0.6)',
                              color: 'white',
                              width: 28,
                              height: 28,
                              '&:hover': {
                                bgcolor: 'rgba(255, 0, 0, 0.8)'
                              }
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              
              {/* Photo Upload Button */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotosChange}
                style={{ display: 'none' }}
                id="photos-upload"
                disabled={loading}
              />
              <label htmlFor="photos-upload">
                <Button
                  variant="outlined"
                  component="span"
                  disabled={loading || selectedPhotos.length >= 10}
                  startIcon={<PhotoCameraIcon />}
                  sx={{ mb: 2 }}
                >
                  {selectedPhotos.length === 0 
                    ? 'Adicionar Fotos' 
                    : `Adicionar Mais Fotos (${selectedPhotos.length}/10)`
                  }
                </Button>
              </label>

              {/* New Photos Preview Grid */}
              {selectedPhotos.length > 0 && (
                <Grid container spacing={2}>
                  {selectedPhotos.map((photo, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Card 
                        elevation={2}
                        sx={{ 
                          position: 'relative',
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="120"
                          image={getPhotoPreviewUrl(photo)}
                          alt={`Nova foto ${index + 1}`}
                          sx={{ objectFit: 'cover' }}
                        />
                        
                        {/* Delete Button */}
                        <IconButton
                          onClick={() => removePhoto(index)}
                          disabled={loading}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            width: 28,
                            height: 28,
                            '&:hover': {
                              bgcolor: 'rgba(255, 0, 0, 0.8)'
                            }
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>

                        {/* Photo Info */}
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            p: 0.5
                          }}
                        >
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontSize: '0.7rem',
                              display: 'block',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {photo.name}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}

                  {/* Add More Photos Card */}
                  {selectedPhotos.length < 10 && (
                    <Grid item xs={6} sm={4} md={3}>
                      <label htmlFor="photos-upload">
                        <Card 
                          elevation={2}
                          sx={{ 
                            height: 120,
                            borderRadius: 2,
                            border: '2px dashed',
                            borderColor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: loading ? 'transparent' : 'primary.light',
                              opacity: loading ? 0.5 : 0.8
                            }
                          }}
                        >
                          <Stack alignItems="center" spacing={1}>
                            <AddIcon 
                              color="primary" 
                              sx={{ fontSize: 32 }}
                            />
                            <Typography 
                              variant="caption" 
                              color="primary"
                              textAlign="center"
                            >
                              Adicionar
                            </Typography>
                          </Stack>
                        </Card>
                      </label>
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading || loadingEvent}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || loadingEvent || !form.title?.trim() || !form.dateStart || !form.location?.trim() || (form.genre !== undefined && form.genre?.length <= 0)}
          sx={{
            background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
            '&:hover': {
              background: 'linear-gradient(45deg, #b71c1c, #f44336)'
            }
          }}
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEventModal;
