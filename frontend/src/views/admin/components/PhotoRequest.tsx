import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TablePagination,
  Typography,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from 'react';
import { PhotoApi, PhotoResponseDtoGenericList, PhotoResponseDto } from '../../../gen/api/src';
import ApiConfiguration from '../../../config/apiConfig';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const PhotoRequest = () => {
  const photoService = new PhotoApi(ApiConfiguration);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState<boolean>(false);
  const [photosData, setPhotosData] = useState<PhotoResponseDtoGenericList>({ 
    items: [], 
    totalCount: 0 
  });
  const [pagination, setPagination] = useState({ 
    page: 0, 
    pageSize: 6, 
    pageCount: 0, 
    search: "" 
  });
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoResponseDto | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPagination(prev => ({
      ...prev,
      pageSize: newPageSize,
      page: 0
    }));
  };

  const handleViewPhoto = (photo: PhotoResponseDto) => {
    setSelectedPhoto(photo);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedPhoto(null);
  };

  const approvePhoto = async (id: number) => {
    setLoading(true);
    try {
      const result = await photoService.apiPhotoApprovePhotoPatch({ 
        photoId: id, 
        isApprove: true 
      });

      if (result.isSuccess) {
        await getPhotosToApprove();
      } else {
        console.error('Error approving photo:', result.message);
      }
    } catch (error) {
      console.error('Error approving photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const rejectPhoto = async (id: number) => {
    setLoading(true);
    try {
      const result = await photoService.apiPhotoApprovePhotoPatch({ 
        photoId: id, 
        isApprove: false 
      });

      if (result.isSuccess) {
        await getPhotosToApprove();
      } else {
        console.error('Error rejecting photo:', result.message);
      }
    } catch (error) {
      console.error('Error rejecting photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPhotosToApprove = async () => {
    setLoading(true);
    try {
      const photos = await photoService.apiPhotoGetPhotoToApproveGet({
        page: pagination.page + 1,
        pageSize: pagination.pageSize,
        pageCount: pagination.pageCount,
        search: pagination.search,
      });

      if (photos.isSuccess) {
        setPhotosData(photos.data!);
      } else {
        console.error('Error loading photos:', photos.message);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPhotosToApprove();
  }, [pagination.page, pagination.pageSize]);

  const PhotoSkeleton = () => (
    <ImageListItem>
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
    </ImageListItem>
  );

  return (
    <>
      <LoadingSpinner isLoading={loading} />
      
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <PhotoLibraryIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold">
            Solicitações de Fotos
          </Typography>
          <Chip 
            label={`${photosData.totalCount || 0} pendentes`}
            color="warning"
            variant="outlined"
          />
        </Box>

        {/* Content */}
        {loading && photosData.items?.length === 0 ? (
          <ImageList 
            sx={{ width: '100%', height: 'auto' }} 
            cols={isMobile ? 2 : 3} 
            gap={16}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <PhotoSkeleton key={index} />
            ))}
          </ImageList>
        ) : photosData.totalCount! <= 0 ? (
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': {
                width: '100%',
                textAlign: 'center'
              }
            }}
          >
            <Typography variant="h6">
              🎉 Nenhuma foto pendente para aprovação
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Todas as fotos foram processadas!
            </Typography>
          </Alert>
        ) : (
          <Box>
            <ImageList 
              sx={{ 
                width: '100%', 
                maxHeight: '70vh', 
                overflow: 'auto',
                borderRadius: 2,
                p: 1
              }} 
              cols={isMobile ? 2 : 3} 
              gap={16}
            >
              {photosData.items!.map((item, index) => (
                <ImageListItem 
                  key={index}
                  sx={{ 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                >
                  <img
                    src={item.src!}
                    alt={item.title!}
                    loading="lazy"
                    style={{
                      height: 200,
                      objectFit: 'cover',
                      width: '100%'
                    }}
                  />
                  <ImageListItemBar
                    title={item.title}
                    subtitle={item.description}
                    sx={{
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)',
                      '& .MuiImageListItemBar-title': {
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      },
                      '& .MuiImageListItemBar-subtitle': {
                        fontSize: '0.75rem',
                        opacity: 0.8
                      }
                    }}
                    actionIcon={
                      <Box sx={{ display: 'flex', gap: 0.5, mr: 1 }}>
                        <IconButton
                          sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                          onClick={() => handleViewPhoto(item)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          sx={{ color: 'rgba(76, 175, 80, 0.9)' }}
                          onClick={() => approvePhoto(item.id!)}
                          disabled={loading}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          sx={{ color: 'rgba(244, 67, 54, 0.9)' }}
                          onClick={() => rejectPhoto(item.id!)}
                          disabled={loading}
                        >
                          <BlockIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>

            {/* Pagination */}
            {photosData.totalCount! > 0 && (
              <Paper elevation={2} sx={{ mt: 3, borderRadius: 2 }}>
                <TablePagination
                  rowsPerPageOptions={[6, 12, 18]}
                  component="div"
                  labelRowsPerPage="Fotos por página"
                  count={photosData.totalCount!}
                  rowsPerPage={pagination.pageSize}
                  page={pagination.page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    '& .MuiTablePagination-toolbar': {
                      justifyContent: 'center'
                    }
                  }}
                />
              </Paper>
            )}
          </Box>
        )}

        {/* View Photo Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={handleCloseViewDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {selectedPhoto?.title}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedPhoto && (
              <Box>
                <Box
                  component="img"
                  src={selectedPhoto.src!}
                  alt={selectedPhoto.title!}
                  sx={{
                    width: '100%',
                    maxHeight: '60vh',
                    objectFit: 'contain',
                    borderRadius: 2,
                    mb: 2
                  }}
                />
                {selectedPhoto.description && (
                  <TextField
                    label="Descrição"
                    value={selectedPhoto.description}
                    fullWidth
                    multiline
                    rows={3}
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2 }}
                  />
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => {
                if (selectedPhoto) {
                  approvePhoto(selectedPhoto.id!);
                  handleCloseViewDialog();
                }
              }}
              disabled={loading}
            >
              Aprovar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<BlockIcon />}
              onClick={() => {
                if (selectedPhoto) {
                  rejectPhoto(selectedPhoto.id!);
                  handleCloseViewDialog();
                }
              }}
              disabled={loading}
            >
              Rejeitar
            </Button>
            <Button onClick={handleCloseViewDialog} color="inherit">
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default PhotoRequest;
