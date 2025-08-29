import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  CardActions, 
  IconButton, 
  Fab, 
  useTheme, 
  useMediaQuery,
  Paper,
  Fade,
  Skeleton,
  Button,
  Chip,
  TablePagination
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import { EventApi, EventResponseDto } from "../../gen/api/src";
import ApiConfiguration from "../../config/apiConfig";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import AddEventModal from "../../components/modals/AddEventModal";
import EditEventModal from "../../components/modals/EditEventModal";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  dateStart: string;
  dateEnd: string;
  price: number;
  capacity: number;
  bannerUrl: string;
  ticketsLink: string;
}

const MyEvents = () => {
  const eventService = new EventApi(ApiConfiguration);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [openAddEventModal, setOpenAddEventModal] = useState(false);
  const [openEditEventModal, setOpenEditEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setFadeIn(true);
    loadMyEvents();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const loadMyEvents = async () => {
    setLoading(true);
    try {
      const result = await eventService.apiEventGetAllGet({
        page: page + 1,
        pageSize: rowsPerPage,
        pageCount: 0,
        search: ''
      });
      
      if (result.isSuccess && result.data?.items) {
        const userEvents: Event[] = result.data.items.map((event: EventResponseDto) => ({
          id: event.id?.toString() || '',
          title: event.title || '',
          description: event.description || '',
          location: event.location || '',
          dateStart: event.dateStart ? new Date(event.dateStart).toISOString().split('T')[0] : '',
          dateEnd: event.dateEnd ? new Date(event.dateEnd).toISOString().split('T')[0] : '',
          price: event.price || 0,
          capacity: event.capacity || 0,
          bannerUrl: event.bannerUrl || '/api/placeholder/400/200',
          ticketsLink: event.ticketsLink || ''
        }));
        setEvents(userEvents);
        setTotalCount(result.data.totalCount || 0);
      } else {
        setEvents([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = () => {
    setOpenAddEventModal(true);
  };

  const handleCloseAddEventModal = () => {
    setOpenAddEventModal(false);
    // Refresh events list after adding
    loadMyEvents();
  };

  const handleEditEvent = (eventId: string) => {
    setEditingEventId(parseInt(eventId));
    setOpenEditEventModal(true);
  };

  const handleCloseEditEventModal = () => {
    setOpenEditEventModal(false);
    setEditingEventId(null);
    // Refresh events list after editing
    loadMyEvents();
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        setLoading(true);
        const result = await eventService.apiEventDeleteEventDelete({
          id: parseInt(eventId)
        });
        
        if (result.isSuccess) {
          setEvents(events.filter(e => e.id !== eventId));
          alert('Evento excluído com sucesso!');
        } else {
          alert(`Erro: ${result.message}`);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Erro ao excluir evento. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Gratuito' : `R$ ${price.toFixed(2)}`;
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  const EventSkeleton = () => (
    <Card sx={{ borderRadius: 2 }}>
      <Skeleton variant="rectangular" height={200} />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
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
              <EventIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography 
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                Meus Eventos
              </Typography>
              <Typography 
                variant="h6"
                sx={{ 
                  opacity: 0.9,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Gerencie seus eventos musicais
              </Typography>
            </Paper>

            {/* Events Grid */}
            {events.length === 0 && !loading ? (
              <Paper
                elevation={2}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: 'grey.50'
                }}
              >
                <EventIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  Nenhum evento encontrado
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Comece criando seu primeiro evento!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddEvent}
                  sx={{
                    background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #b71c1c, #f44336)'
                    }
                  }}
                >
                  Criar Primeiro Evento
                </Button>
              </Paper>
            ) : (
              <>
                <Grid container spacing={3}>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <EventSkeleton />
                      </Grid>
                    ))
                  ) : (
                    events.map((event) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                        <Card
                          sx={{
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                            }
                          }}
                          onClick={() => handleEventClick(event.id)}
                        >
                          <CardMedia
                            component="img"
                            height="200"
                            image={event.bannerUrl}
                            alt={event.title}
                            sx={{ objectFit: 'cover' }}
                          />
                          <CardContent sx={{ p: 2 }}>
                            <Typography 
                              variant="h6" 
                              noWrap
                              sx={{ fontWeight: 600, mb: 1 }}
                            >
                              {event.title}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                noWrap
                              >
                                {event.location}
                              </Typography>
                            </Box>
                            
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              {formatDate(event.dateStart)}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Chip 
                                label={formatPrice(event.price)} 
                                size="small" 
                                color={event.price === 0 ? 'success' : 'primary'}
                                variant="outlined"
                              />
                              {event.capacity > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <PeopleIcon sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {event.capacity}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </CardContent>
                          <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditEvent(event.id);
                              }}
                              sx={{ color: 'primary.main' }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(event.id);
                              }}
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

                {/* Pagination */}
                {totalCount > rowsPerPage && (
                  <Paper elevation={2} sx={{ mt: 4, borderRadius: 2 }}>
                    <TablePagination
                      rowsPerPageOptions={[12, 24, 48]}
                      component="div"
                      labelRowsPerPage="Eventos por página"
                      count={totalCount}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Paper>
                )}
              </>
            )}

            {/* FAB for mobile */}
            {isMobile && (
              <Fab
                color="primary"
                onClick={handleAddEvent}
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
            {!isMobile && events.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleAddEvent}
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
                  Criar Novo Evento
                </Button>
              </Box>
            )}
          </Box>
        </Fade>
        </Container>
      </Box>

      {/* Add Event Modal */}
      <AddEventModal 
        open={openAddEventModal} 
        onClose={handleCloseAddEventModal}
      />
      
      {/* Edit Event Modal */}
      {editingEventId && (
        <EditEventModal 
          open={openEditEventModal} 
          onClose={handleCloseEditEventModal}
          eventId={editingEventId}
        />
      )}
    </>
  );
};

export default MyEvents;
