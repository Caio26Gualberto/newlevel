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
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Photo as PhotoIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import { PhotoApi, PhotoResponseDtoGenericList } from "../../gen/api/src";
import ApiConfiguration from "../../config/apiConfig";
import AddPhotoModal from "../../components/modals/AddPhotoModal";
import CommentsModal from "../../components/modals/CommentsModal";
import * as toastr from 'toastr';

const Photos = () => {
  const photoService = new PhotoApi(ApiConfiguration);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [photos, setPhotos] = useState<PhotoResponseDtoGenericList>({ items: [], totalCount: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [commentsModal, setCommentsModal] = useState({ open: false, photoId: 0, title: "" });
  const [pagination, setPagination] = useState({ 
    page: 1, 
    pageSize: 12, 
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
    getPhotos(); // Refresh photos after modal close
  };

  const handleOpenComments = (photoId: number, title: string) => {
    setCommentsModal({ open: true, photoId, title });
  };

  const handleCloseComments = () => {
    setCommentsModal({ open: false, photoId: 0, title: "" });
  };

  const search = async () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    getPhotos();
  };

  const getPhotos = async () => {
    setLoading(true);
    try {
      const result = await photoService.apiPhotoGetAllPhotosGet({
        page: pagination.page,
        pageSize: pagination.pageSize,
        pageCount: 0,
        search: pagination.search
      });
      
      if (result.isSuccess) {
        setPhotos(result.data!);
      } else {
        toastr.error(result.message!, 'Erro!', { 
          timeOut: 3000, 
          progressBar: true, 
          positionClass: "toast-bottom-right" 
        });
      }
    } catch (error) {
      toastr.error('Erro ao carregar fotos', 'Erro!', { 
        timeOut: 3000, 
        progressBar: true, 
        positionClass: "toast-bottom-right" 
      });
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil((photos.totalCount || 0) / pagination.pageSize);

  useEffect(() => {
    getPhotos();
  }, [pagination.page]);

  const renderPhotoSkeleton = () => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Skeleton variant="rectangular" height={200} />
        <Box p={2}>
          <Skeleton variant="text" height={32} />
          <Skeleton variant="text" height={24} width="60%" />
          <Skeleton variant="text" height={20} width="40%" />
        </Box>
      </Paper>
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
        <PhotoIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom color="text.secondary">
          {pagination.search ? 'Nenhuma foto encontrada' : 'Nenhuma foto disponível'}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          {pagination.search 
            ? 'Tente ajustar sua pesquisa ou limpar os filtros'
            : 'Seja o primeiro a compartilhar uma foto!'
          }
        </Typography>
        {!pagination.search && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
            size="large"
          >
            Adicionar Primeira Foto
          </Button>
        )}
      </Paper>
    </Grid>
  );

  return (
    <>
      {/* Add Photo Modal */}
      <AddPhotoModal open={openModal} onClose={handleCloseModal} />
      
      {/* Comments Modal */}
      <CommentsModal 
        open={commentsModal.open}
        onClose={handleCloseComments}
        photoId={commentsModal.photoId}
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
                    Galeria de Fotos
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

                {/* Add Photo Button - Desktop */}
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
                    Adicionar Foto
                  </Button>
                )}
              </Stack>
            </Paper>

            {/* Photos Grid */}
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {loading ? (
                // Loading skeletons
                Array.from({ length: pagination.pageSize }).map((_, index) => (
                  <React.Fragment key={index}>
                    {renderPhotoSkeleton()}
                  </React.Fragment>
                ))
              ) : photos.items?.length ? (
                // Photos
                photos.items.map((photo, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id || index}>
                    <Fade in timeout={600 + index * 100}>
                      <Paper 
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
                        {/* Photo Card Content - Placeholder for now */}
                        <Box
                          sx={{
                            height: 200,
                            background: `url(${photo.src}) center/cover`,
                            backgroundColor: 'grey.200',
                            position: 'relative'
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
                              <PhotoIcon sx={{ fontSize: 48 }} />
                            </Box>
                          )}
                        </Box>
                        <Box p={2}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                            {photo.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {photo.subtitle}
                          </Typography>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              mt: 1
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Por: {photo.nickname}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenComments(photo.id!, photo.title!)}
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
                          </Box>
                        </Box>
                      </Paper>
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

export default Photos;
