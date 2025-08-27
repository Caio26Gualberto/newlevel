import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Container,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  Fab,
  Skeleton,
  Pagination,
  useTheme,
  useMediaQuery,
  Stack,
  Fade,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  VideoLibrary as VideoIcon,
  PlayArrow as PlayIcon,
  Person as PersonIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import { MediaApi, MediaDtoGenericListNewLevelResponse } from "../../gen/api/src";
import ApiConfiguration from "../../config/apiConfig";
import VideoPlayer from "../../components/common/VideoPlayer";
import CommentsModal from "../../components/modals/CommentsModal";
import Swal from "sweetalert2";
import AddVideoModal from "../../components/modals/AddVideoModal";

const Videos = () => {
  const mediaService = new MediaApi(ApiConfiguration);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [commentsModal, setCommentsModal] = useState({ open: false, mediaId: 0, title: "" });
  const [data, setData] = useState<MediaDtoGenericListNewLevelResponse>({ 
    data: { items: [], totalCount: 0 }, 
    isSuccess: false, 
    message: "" 
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    searchMedia(); // Refresh videos after modal close
  };

  const handleOpenComments = (mediaId: number, title: string) => {
    setCommentsModal({ open: true, mediaId, title });
  };

  const handleCloseComments = () => {
    setCommentsModal({ open: false, mediaId: 0, title: "" });
  };

  const search = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    searchMedia();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const searchMedia = async () => {
    try {
      setLoading(true);
      const mediasResult = await mediaService.apiMediaGetMediaGet({  
        page: pagination.page,
        pageSize: pagination.pageSize,
        pageCount: 0,
        search: searchTerm       
      });

      if (mediasResult.isSuccess) {
        setData(mediasResult);
      } else {
        Swal.fire({
          title: 'Erro',
          text: mediasResult.message!,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Erro',
        text: 'Erro ao carregar vídeos',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil((data.data?.totalCount || 0) / pagination.pageSize);

  useEffect(() => {
    searchMedia();
  }, [pagination.page]);

  const renderVideoSkeleton = () => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card elevation={4} sx={{ borderRadius: 3 }}>
        <Skeleton variant="rectangular" height={180} />
        <CardContent>
          <Skeleton variant="text" height={32} />
          <Skeleton variant="text" height={24} width="60%" />
          <Skeleton variant="text" height={20} width="40%" />
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
        <VideoIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom color="text.secondary">
          {searchTerm ? 'Nenhum vídeo encontrado' : 'Nenhum vídeo disponível'}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          {searchTerm 
            ? 'Tente ajustar sua pesquisa ou limpar os filtros'
            : 'Seja o primeiro a compartilhar um vídeo!'
          }
        </Typography>
        {!searchTerm && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
            size="large"
          >
            Adicionar Primeiro Vídeo
          </Button>
        )}
      </Paper>
    </Grid>
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <>
      {/* Add Video Modal */}
      <AddVideoModal open={openModal} onClose={handleCloseModal} />
      
      {/* Comments Modal */}
      <CommentsModal 
        open={commentsModal.open}
        onClose={handleCloseComments}
        mediaId={commentsModal.mediaId}
        title={commentsModal.title}
      />
      
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
                    Biblioteca de Vídeos
                  </Typography>
                  
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    maxWidth={{ xs: '100%', md: 400 }}
                  >
                    <TextField
                      fullWidth
                      placeholder="Pesquisar por título..."
                      value={searchTerm}
                      onChange={handleInputChange}
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

                {/* Add Video Button - Desktop */}
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
                    Adicionar Vídeo
                  </Button>
                )}
              </Stack>
            </Paper>

            {/* Videos Grid */}
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {loading ? (
                // Loading skeletons
                Array.from({ length: pagination.pageSize }).map((_, index) => (
                  <React.Fragment key={index}>
                    {renderVideoSkeleton()}
                  </React.Fragment>
                ))
              ) : data.data?.items?.length ? (
                // Videos
                data.data.items.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id || index}>
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
                        {/* Video Player */}
                        <VideoPlayer
                          videoUrl={item.src!}
                          title={item.title!}
                          height={180}
                        />

                        <CardContent sx={{ pb: 1 }}>
                          <Typography 
                            variant="h6" 
                            fontWeight="bold" 
                            gutterBottom 
                            noWrap
                            title={item.title || undefined}
                          >
                            {item.title || ''}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              minHeight: 40
                            }}
                          >
                            {item.description}
                          </Typography>
                        </CardContent>

                        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                          <Stack 
                            direction="row" 
                            alignItems="center" 
                            spacing={1}
                            sx={{ width: '100%' }}
                          >
                            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {item.nickname}
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <IconButton
                              size="small"
                              onClick={() => handleOpenComments(item.id!, item.title!)}
                              sx={{
                                color: 'primary.main',
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                  color: 'white',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <CommentIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(new Date(item.creationTime!))}
                            </Typography>
                          </Stack>
                        </CardActions>
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
    </>
  );
};

export default Videos;
