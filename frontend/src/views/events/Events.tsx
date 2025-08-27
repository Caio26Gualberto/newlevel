import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Fab,
  CardMedia,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  ConfirmationNumber as TicketIcon,
  Comment as CommentIcon,
  MusicNote as MusicIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { EEventStatus } from "../../types/Event";
import PhotoGallery from "../../components/common/PhotoGallery";
import AddEventModal from "../../components/modals/AddEventModal";
import * as toastr from 'toastr';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EventApi, EventResponseDto, EventResponseDtoGenericList } from "../../gen/api/src";
import ApiConfiguration from "../../config/apiConfig";

const Events = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const eventService = new EventApi(ApiConfiguration);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [events, setEvents] = useState<EventResponseDtoGenericList>({ items: [], totalCount: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [descriptionModal, setDescriptionModal] = useState<{ open: boolean; title: string; description: string }>({ open: false, title: '', description: '' });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 8,
    search: ''
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    getEvents(); // Refresh events after modal close
  };

  const search = async () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    getEvents();
  };

  const getEvents = async () => {
    setLoading(true);
    try {
      // Chamada real da API
      const result = await eventService.apiEventGetAllGet({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: pagination.search
      });

      if (result.isSuccess) {
        setEvents(result.data!);
        return; // retorna para não sobrescrever com mock
      }

      // Se a API falhar ou não retornar sucesso, você pode usar mockEvents
      const mockEvents: EventResponseDto[] = [
        {
          id: 1,
          title: "Rock Festival 2024",
          description: "O maior festival de rock da região com bandas nacionais e internacionais",
          dateStart: new Date("2024-12-15T20:00:00"),
          dateEnd: new Date("2024-12-16T02:00:00"),
          location: "Estádio Municipal - São Paulo, SP",
          bannerUrl: "/assets/event-banner-1.jpg",
          organizerId: 1,
          organizerName: "Rock Events",
          price: 150.0,
          capacity: 5000,
          eventStatus: EEventStatus.Published,
          ticketsLink: "https://tickets.com/rock-festival-2024",
          genre: [1, 2], // Rock, Metal
          // photosSrc: [
          //   "/assets/event-photo-1.jpg",
          //   "/assets/event-photo-2.jpg",
          //   "/assets/event-photo-3.jpg",
          //   "/assets/event-photo-4.jpg",
          //   "/assets/event-photo-5.jpg",
          //   "/assets/event-photo-6.jpg",
          //   "/assets/event-photo-7.jpg",
          //   "/assets/event-photo-8.jpg",
          // ],
          commentsCount: 25
        },
        {
          id: 2,
          title: "Metal Underground Night",
          description: "Noite especial dedicada ao metal underground com bandas locais. Este evento promete ser uma experiência única para os amantes do metal mais pesado, com apresentações de bandas que estão revolucionando a cena underground nacional. Teremos também food trucks especializados, área de merchandise exclusiva e muito mais. Não perca esta oportunidade de vivenciar o melhor do metal brasileiro em um ambiente intimista e cheio de energia.",
          dateStart: new Date("2024-11-30T21:00:00"),
          dateEnd: null,
          location: "Club Metal - Rio de Janeiro, RJ",
          organizerId: 2,
          organizerName: "Underground Events",
          price: 80.0,
          capacity: 300,
          eventStatus: EEventStatus.Published,
          genre: [2, 3], // Metal, Heavy Metal
          // photosSrc: [
          //   "/assets/event-photo-9.jpg",
          //   "/assets/event-photo-10.jpg",
          // ],
          commentsCount: 12
        }
      ];

      setEvents({ items: mockEvents, totalCount: mockEvents.length });

    } catch (error) {
      toastr.error('Erro ao carregar eventos', 'Erro!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: "toast-bottom-right"
      });
    } finally {
      setLoading(false);
    }
  };


  const getStatusColor = (status: EEventStatus) => {
    switch (status) {
      case EEventStatus.Draft: return 'default';
      case EEventStatus.Published: return 'success';
      case EEventStatus.InProgress: return 'warning';
      case EEventStatus.Completed: return 'info';
      case EEventStatus.Cancelled: return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: EEventStatus) => {
    switch (status) {
      case EEventStatus.Draft: return 'Rascunho';
      case EEventStatus.Published: return 'Publicado';
      case EEventStatus.InProgress: return 'Em Andamento';
      case EEventStatus.Completed: return 'Finalizado';
      case EEventStatus.Cancelled: return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  const formatDate = (date?: Date | string): string => {
    if (!date) return "";

    try {
      const d = date instanceof Date ? date : new Date(date);
      return format(d, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
    } catch {
      return String(date);
    }
  };

  const formatDateRange = (startDate?: Date | string, endDate?: Date | string | null): string => {
    if (!startDate) return "";

    const formattedStart = formatDate(startDate);

    if (!endDate || endDate === null) {
      return `${formattedStart} - o dia inteiro`;
    }

    const formattedEnd = formatDate(endDate);
    return `${formattedStart} até ${formattedEnd}`;
  };

  const truncateDescription = (description: string, maxLength: number = 280): { text: string; isTruncated: boolean } => {
    if (description.length <= maxLength) {
      return { text: description, isTruncated: false };
    }
    return { text: description.substring(0, maxLength) + '...', isTruncated: true };
  };

  const handleReadMore = (title: string, description: string) => {
    setDescriptionModal({ open: true, title, description });
  };

  const getGenreNames = (genreIds?: number[]): string[] => {
    if (!genreIds || genreIds.length === 0) return [];

    const genreMap: { [key: number]: string } = {
      1: 'Rock',
      2: 'Metal',
      3: 'Heavy Metal',
      4: 'Pop',
      5: 'Jazz',
      6: 'Blues',
      7: 'Country',
      8: 'Eletrônica',
      9: 'Reggae',
      10: 'Hip Hop'
    };

    return genreIds.map(id => genreMap[id] || 'Desconhecido').filter(Boolean);
  };

  const totalPages = Math.ceil((events.totalCount || 0) / pagination.pageSize);

  useEffect(() => {
    getEvents();
  }, [pagination.page]);

  const renderEventSkeleton = () => (
    <Grid item xs={12} md={6} lg={6}>
      <Card elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={32} />
          <Skeleton variant="text" height={24} width="80%" />
          <Skeleton variant="text" height={20} width="60%" />
          <Box mt={2}>
            <Skeleton variant="rectangular" height={100} />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderEmptyState = () => (
    <Grid item xs={12}>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 4, sm: 6 },
          textAlign: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
        }}
      >
        <EventIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom color="text.secondary">
          {pagination.search ? 'Nenhum evento encontrado' : 'Nenhum evento disponível'}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          {pagination.search
            ? 'Tente ajustar sua pesquisa ou limpar os filtros'
            : 'Seja o primeiro a criar um evento!'
          }
        </Typography>
        {!pagination.search && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
            size="large"
          >
            Criar Primeiro Evento
          </Button>
        )}
      </Paper>
    </Grid>
  );

  return (
    <>
      {/* Add Event Modal */}
      <AddEventModal open={openModal} onClose={handleCloseModal} />

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Fade in timeout={600}>
          <Box>
            {/* Header */}
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                mb: { xs: 2, sm: 3 },
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={{ xs: 2, md: 3 }}
                alignItems={{ xs: 'stretch', md: 'center' }}
                justifyContent="space-between"
              >
                {/* Title and Search */}
                <Stack spacing={2} flex={1}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    className="gradient-text"
                    sx={{
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                      background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Eventos
                  </Typography>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    maxWidth={{ xs: '100%', md: 400 }}
                  >
                    <TextField
                      fullWidth
                      placeholder="Pesquisar eventos..."
                      value={pagination.search}
                      onChange={(e) => setPagination(prev => ({ ...prev, search: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && search()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'background.paper'
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={search}
                      disabled={loading}
                      sx={{
                        minWidth: { xs: 'auto', sm: 120 },
                        height: 56,
                        borderRadius: 2
                      }}
                    >
                      <SearchIcon />
                    </Button>
                  </Stack>
                </Stack>

                {/* Add Event Button - Desktop */}
                {!isMobile && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenModal}
                    size="large"
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[8]
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Criar Evento
                  </Button>
                )}
              </Stack>
            </Paper>

            {/* Events Grid */}
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {loading ? (
                // Loading skeletons
                Array.from({ length: pagination.pageSize }).map((_, index) => (
                  <React.Fragment key={index}>
                    {renderEventSkeleton()}
                  </React.Fragment>
                ))
              ) : events.items?.length ? (
                // Events
                events.items.map((event, index) => (
                  <Grid item xs={12} md={6} lg={6} key={event.id || index}>
                    <Fade in timeout={600 + index * 100}>
                      <Card
                        elevation={4}
                        sx={{
                          borderRadius: 3,
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: theme.shadows[12]
                          }
                        }}
                      >
                        {/* Event Banner */}
                        <CardMedia
                          sx={{
                            height: 200,
                            background: event.bannerUrl
                              ? `url(${event.bannerUrl}) center/cover`
                              : 'linear-gradient(135deg, #d32f2f 0%, #ff6b6b 100%)',
                            position: 'relative'
                          }}
                        >
                          {!event.bannerUrl && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white'
                              }}
                            >
                              <EventIcon sx={{ fontSize: 48 }} />
                            </Box>
                          )}

                          {/* Status Chip */}
                          <Chip
                            label={getStatusText(event.eventStatus!)}
                            color={getStatusColor(event.eventStatus!)}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              fontWeight: 'bold'
                            }}
                          />
                        </CardMedia>

                        <CardContent sx={{ p: 3 }}>
                          {/* Event Title and Description */}
                          <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {event.title}
                          </Typography>

                          {/* Genres */}
                          {event.genre && event.genre.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                <MusicIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                <Typography variant="body2" fontWeight="bold">
                                  Gêneros:
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {getGenreNames(event.genre).map((genre, index) => (
                                  <Chip
                                    key={index}
                                    label={genre}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontSize: '0.75rem' }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                          )}

                          {/* Description with Read More */}
                          <Box sx={{ mb: 2 }}>
                            {(() => {
                              const { text, isTruncated } = truncateDescription(event.description || '');
                              return (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
                                  {text}
                                  {isTruncated && (
                                    <Button
                                      size="small"
                                      onClick={() => handleReadMore(event.title || '', event.description || '')}
                                      sx={{
                                        p: 0,
                                        minWidth: 'auto',
                                        textTransform: 'none',
                                        fontSize: '0.75rem',
                                        display: 'inline',
                                        ml: 0.5 // pequeno espaço entre texto e botão
                                      }}
                                    >
                                      ler mais
                                    </Button>
                                  )}
                                </Typography>
                              );
                            })()}
                          </Box>

                          {/* Event Details */}
                          <Stack spacing={1} mb={2}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <CalendarIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                              <Typography variant="body2">
                                {formatDateRange(event.dateStart!, event.dateEnd || undefined)}
                              </Typography>
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={1}>
                              <LocationIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                              <Typography variant="body2" noWrap>
                                {event.location}
                              </Typography>
                            </Stack>

                            {event.price && (
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <MoneyIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                <Typography variant="body2">
                                  A partir de R$ {event.price.toFixed(2)}
                                </Typography>
                              </Stack>
                            )}

                            {event.capacity && (
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <PeopleIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                <Typography variant="body2">
                                  Capacidade: {event.capacity} pessoas
                                </Typography>
                              </Stack>
                            )}
                          </Stack>

                          <Divider sx={{ my: 2 }} />

                          {/* Photo Gallery */}
                          {event.photos && event.photos.length > 0 && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                                Fotos do Evento
                              </Typography>
                              <PhotoGallery photos={event.photos} maxVisible={6} />
                            </Box>
                          )}

                          {/* Action Buttons */}
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            justifyContent="space-between"
                            alignItems={{ xs: 'stretch', sm: 'center' }}
                          >
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="caption" color="text.secondary">
                                Por: {event.organizerName}
                              </Typography>
                              {event.commentsCount !== null && event.commentsCount !== undefined && event.commentsCount > 0 && (
                                <IconButton size="small" sx={{ color: 'primary.main' }}>
                                  <CommentIcon sx={{ fontSize: 16 }} />
                                  <Typography variant="caption" ml={0.5}>
                                    {event.commentsCount}
                                  </Typography>
                                </IconButton>
                              )}
                            </Stack>

                            {event.ticketsLink && (
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<TicketIcon />}
                                href={event.ticketsLink}
                                target="_blank"
                                sx={{
                                  background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
                                  '&:hover': {
                                    background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)'
                                  }
                                }}
                              >
                                Ingressos
                              </Button>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))
              ) : (
                // Empty state
                renderEmptyState()
              )}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: { xs: 3, sm: 4 }
                }}
              >
                <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                    showFirstButton
                    showLastButton
                  />
                </Paper>
              </Box>
            )}
          </Box>
        </Fade>
      </Container>

      {/* Mobile FAB */}
      {isMobile && (
        <Fab
          color="primary"
          onClick={handleOpenModal}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Add Event Modal */}
      <AddEventModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />

      {/* Description Modal */}
      <Dialog
        open={descriptionModal.open}
        onClose={() => setDescriptionModal({ open: false, title: '', description: '' })}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {descriptionModal.title}
          </Typography>
          <IconButton
            onClick={() => setDescriptionModal({ open: false, title: '', description: '' })}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap'
            }}
          >
            {descriptionModal.description}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDescriptionModal({ open: false, title: '', description: '' })}
            variant="outlined"
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Events;
