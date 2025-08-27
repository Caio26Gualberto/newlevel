import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  IconButton,
  TablePagination,
  TextField,
  Typography,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { useEffect, useState } from 'react';
import { MediaApi, MediaDtoGenericList } from '../../../gen/api/src';
import ApiConfiguration from '../../../config/apiConfig';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const VideoRequest = () => {
  const mediaService = new MediaApi(ApiConfiguration);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [expanded, setExpanded] = useState<string | false>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [videosToApprove, setVideosToApprove] = useState<MediaDtoGenericList>({ 
    items: [], 
    totalCount: 0 
  });
  const [pagination, setPagination] = useState({ 
    page: 0, 
    pageSize: 12, 
    pageCount: 0, 
    search: "" 
  });

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

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const acceptVideo = async (id: number) => {
    setLoading(true);
    try {
      const result = await mediaService.apiMediaApproveMediaPatch({
        approveMediaInput: {
          mediaId: id,
          isApproved: true
        }
      })
      if (result.isSuccess) {
        await searchMedia();
      } else {
        console.error('Error approving video:', result.message);
      }
    } catch (error) {
      console.error('Error approving video:', error);
    } finally {
      setLoading(false);
    }
  };

  const rejectVideo = async (id: number) => {
    setLoading(true);
    try {
      const result = await mediaService.apiMediaApproveMediaPatch({
        approveMediaInput: {
          mediaId: id,
          isApproved: false
        }
      })
      if (result.isSuccess) {
        await searchMedia();
      } else {
        console.error('Error rejecting video:', result.message);
      }
    } catch (error) {
      console.error('Error rejecting video:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchMedia = async () => {
    setLoading(true);
    try {
      const result = await mediaService.apiMediaGetMediaToApproveGet({
        page: pagination.page + 1,
        pageSize: pagination.pageSize,
        pageCount: pagination.pageCount,
        search: pagination.search,
      });

      if (result.isSuccess) {
        setVideosToApprove(result.data!);
      } else {
        console.error('Error loading videos:', result.message);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchMedia();
  }, [pagination.page, pagination.pageSize]);

  const VideoSkeleton = () => (
    <Paper elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="40%" height={32} />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Skeleton variant="rectangular" width={360} height={200} sx={{ borderRadius: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 1 }} />
          </Box>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <>
      <LoadingSpinner isLoading={loading} />
      
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <VideoLibraryIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold">
            Solicitações de Vídeos
          </Typography>
          <Chip 
            label={`${videosToApprove.totalCount || 0} pendentes`}
            color="warning"
            variant="outlined"
          />
        </Box>

        {/* Content */}
        {loading && videosToApprove.items?.length === 0 ? (
          <Box>
            {Array.from({ length: 3 }).map((_, index) => (
              <VideoSkeleton key={index} />
            ))}
          </Box>
        ) : videosToApprove.items?.length === 0 ? (
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
              🎉 Nenhum vídeo pendente para aprovação
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Todos os vídeos foram processados!
            </Typography>
          </Alert>
        ) : (
          <Box>
            {videosToApprove.items!.map((video, index) => (
              <Accordion
                key={video.id}
                expanded={expanded === `panel${video.id}`}
                onChange={handleChange(`panel${video.id}`)}
                elevation={2}
                sx={{
                  mb: 2,
                  borderRadius: '12px !important',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    margin: '0 0 16px 0'
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    borderRadius: '12px',
                    '&.Mui-expanded': {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <VideoLibraryIcon color="primary" />
                    <Typography fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                      {video.title}
                    </Typography>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: 3,
                      alignItems: { xs: 'center', md: 'flex-start' }
                    }}
                  >
                    {/* Video Player */}
                    <Box
                      sx={{
                        minWidth: { xs: '100%', md: 360 },
                        maxWidth: { xs: '100%', md: 360 }
                      }}
                    >
                      <iframe
                        width="100%"
                        height="200"
                        src={video.src!}
                        title={video.title!}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        style={{
                          border: "0px",
                          borderRadius: "12px",
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                    </Box>

                    {/* Description */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Descrição:
                      </Typography>
                      <TextField
                        value={video.description || 'Sem descrição'}
                        fullWidth
                        multiline
                        rows={6}
                        InputProps={{
                          readOnly: true,
                          sx: {
                            bgcolor: 'grey.50',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'grey.300'
                            }
                          }
                        }}
                      />
                    </Box>

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'row', md: 'column' },
                        gap: 2,
                        alignItems: 'center'
                      }}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => acceptVideo(video.id!)}
                        disabled={loading}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          fontWeight: 'bold'
                        }}
                      >
                        Aprovar
                      </Button>
                      
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<BlockIcon />}
                        onClick={() => rejectVideo(video.id!)}
                        disabled={loading}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          fontWeight: 'bold'
                        }}
                      >
                        Rejeitar
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}

            {/* Pagination */}
            {videosToApprove.items!.length > 0 && (
              <Paper elevation={2} sx={{ mt: 3, borderRadius: 2 }}>
                <TablePagination
                  rowsPerPageOptions={[12, 24, 48]}
                  component="div"
                  labelRowsPerPage="Vídeos por página"
                  count={videosToApprove.totalCount!}
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
      </Box>
    </>
  );
};

export default VideoRequest;
