import { 
  Accordion, 
  AccordionDetails, 
  AccordionSummary, 
  Box, 
  Button, 
  Container,
  Divider, 
  TextField, 
  Typography, 
  useTheme, 
  useMediaQuery,
  Paper,
  Fade,
  TablePagination,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import React, { useEffect, useState } from "react";
import { MediaApi, MediaByUserIdDto, MediaByUserIdDtoGenericListNewLevelResponse } from "../../gen/api/src";
import ApiConfiguration from "../../config/apiConfig";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const MyVideos = () => {
  const mediaApi = new MediaApi(ApiConfiguration);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [descriptionEdit, setDescriptionEdit] = useState("");
  const [expanded, setExpanded] = useState<string | false>(false);
  const [editingVideoId, setEditingVideoId] = useState<number | null>(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [userVideosData, setUserVideosData] = useState<MediaByUserIdDtoGenericListNewLevelResponse>({ 
    data: { items: [], totalCount: 0 }, 
    isSuccess: false, 
    message: "" 
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [newVideoForm, setNewVideoForm] = useState({
    title: '',
    url: '',
    description: ''
  });

  useEffect(() => {
    setFadeIn(true);
    fetchUserVideos();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const search = () => {
    fetchUserVideos();
    setSearchTerm('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleEditStart = (data: MediaByUserIdDto) => {
    setDescriptionEdit(data.description!);
    setEditingVideoId(data.id!);
  };

  const handleEditCancel = () => {
    setEditingVideoId(null);
    setDescriptionEdit("");
  };

  const deleteMediaById = async (mediaId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este vídeo?')) {
      return;
    }

    try {
      setLoading(true);
      const media = await mediaApi.apiMediaDeleteMediaByIdPost({
        id: mediaId
      });

      if (media.isSuccess) {
        setUserVideosData({
          ...userVideosData,
          data: {
            ...userVideosData.data,
            items: userVideosData.data?.items?.filter((item) => item.id !== mediaId)
          }
        });
      } else {
        alert(`Erro: ${media.message}`);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Erro ao excluir vídeo');
    } finally {
      setEditingVideoId(null);
      setLoading(false);
    }
  };

  const updateMediaById = async (newDescription: string, mediaId: number) => {
    try {
      setLoading(true);
      const media = await mediaApi.apiMediaUpdateMediaByIdPost({
        updateMediaByIdInput: {
          description: newDescription,
          mediaId: mediaId
        }
      });

      if (media.isSuccess) {
        setUserVideosData({
          ...userVideosData,
          data: {
            ...userVideosData.data,
            items: userVideosData.data?.items?.map((item) => {
              if (item.id === mediaId) {
                return {
                  ...item,
                  description: newDescription
                };
              }
              return item;
            })
          }
        });
      } else {
        alert(`Erro: ${media.message}`);
      }
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Erro ao atualizar vídeo');
    } finally {
      setEditingVideoId(null);
      setLoading(false);
    }
  };

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const fetchUserVideos = async () => {
    try {
      setLoading(true);
      const userVideos = await mediaApi.apiMediaGetMediasByUserIdPost({
        pagination: {
          page: page + 1,
          pageSize: rowsPerPage,
          pageCount: 0,
          search: searchTerm
        }
      });

      if (userVideos.isSuccess) {
        setUserVideosData(userVideos);
      } else {
        alert(`Erro: ${userVideos.message}`);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async () => {
    if (!newVideoForm.title.trim() || !newVideoForm.url.trim()) {
      alert('Por favor, preencha título e URL do vídeo.');
      return;
    }

    try {
      setLoading(true);
      
      // API call to request media (like in original project)
      const result = await mediaApi.apiMediaRequestMediaPost({
        requestMediaDto: {
          src: newVideoForm.url,
          title: newVideoForm.title,
          description: newVideoForm.description
        }
      });

      if (result.isSuccess) {
        alert('Vídeo enviado para aprovação com sucesso!');
        setNewVideoForm({ title: '', url: '', description: '' });
        setOpenAddDialog(false);
        // Refresh the list to get updated data
        fetchUserVideos();
      } else {
        alert(`Erro: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Erro ao adicionar vídeo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
              <VideoLibraryIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography 
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                Meus Vídeos
              </Typography>
              <Typography 
                variant="h6"
                sx={{ 
                  opacity: 0.9,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Gerencie sua biblioteca de vídeos
              </Typography>
            </Paper>

            {userVideosData.data?.items?.length! > 0 ? (
              <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                {/* Search Section */}
                <Box 
                  sx={{
                    p: 3,
                    bgcolor: 'grey.50',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                      alignItems: { xs: "stretch", sm: "center" },
                      justifyContent: "space-between"
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                      <TextField
                        value={searchTerm}
                        placeholder="Pesquisar por título..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        onChange={handleInputChange}
                        sx={{ maxWidth: { sm: 400 } }}
                      />
                      <IconButton 
                        onClick={search}
                        color="primary"
                        sx={{ 
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.dark' }
                        }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </Box>

                    {!isMobile && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenAddDialog(true)}
                        sx={{
                          background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #b71c1c, #f44336)'
                          }
                        }}
                      >
                        Adicionar Vídeo
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Videos List */}
                <Box sx={{ p: 2 }}>
                  {userVideosData.data?.items!.map((data) => (
                    <Accordion 
                      key={data.id}
                      expanded={expanded === `panel${data.id}`} 
                      onChange={handleChange(`panel${data.id}`)}
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        '&:before': { display: 'none' },
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          bgcolor: 'grey.50',
                          borderRadius: '8px 8px 0 0',
                          '&.Mui-expanded': {
                            borderRadius: '8px 8px 0 0'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Typography 
                            variant="h6"
                            sx={{ 
                              fontWeight: 600,
                              flex: 1,
                              fontSize: { xs: "1rem", sm: "1.25rem" }
                            }}
                          >
                            {data.title}
                          </Typography>
                          <Chip 
                            label="Meu Vídeo" 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </Box>
                      </AccordionSummary>
                      
                      <AccordionDetails sx={{ p: 3 }}>
                        <Box 
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", lg: "row" },
                            gap: 3
                          }}
                        >
                          {/* Video Player */}
                          <Box
                            sx={{
                              flex: 1,
                              position: "relative",
                              paddingTop: "56.25%",
                              borderRadius: 2,
                              overflow: "hidden",
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                          >
                            <iframe 
                              src={data.url!} 
                              title={data.title!}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin" 
                              allowFullScreen 
                              style={{ 
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                border: "0px"
                              }}
                            />
                          </Box>

                          {/* Description and Actions */}
                          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="h6" color="text.secondary">
                              Descrição
                            </Typography>
                            
                            <TextField
                              value={editingVideoId === data.id ? descriptionEdit : data.description}
                              onChange={(e) => setDescriptionEdit(e.target.value)}
                              fullWidth
                              multiline
                              rows={6}
                              disabled={editingVideoId !== data.id}
                              variant="outlined"
                              placeholder="Adicione uma descrição para seu vídeo..."
                            />

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              {editingVideoId === data.id ? (
                                <>
                                  <Button
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    onClick={handleEditCancel}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={() => updateMediaById(descriptionEdit, data.id!)}
                                    color="success"
                                  >
                                    Salvar
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => handleEditStart(data)}
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => deleteMediaById(data.id!)}
                                    color="error"
                                  >
                                    Excluir
                                  </Button>
                                </>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>

                {/* Pagination */}
                <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <TablePagination
                    rowsPerPageOptions={[12, 24, 48]}
                    component="div"
                    labelRowsPerPage="Vídeos por página"
                    count={userVideosData.data!.totalCount!}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Box>
              </Paper>
            ) : (
              <Paper
                elevation={2}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: 'grey.50'
                }}
              >
                <VideoLibraryIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  Nenhum vídeo encontrado
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Você ainda não possui nenhum vídeo. Comece a postar! 😊
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenAddDialog(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #b71c1c, #f44336)'
                    }
                  }}
                >
                  Adicionar Primeiro Vídeo
                </Button>
              </Paper>
            )}

            {/* FAB for mobile */}
            {isMobile && (
              <Fab
                color="primary"
                onClick={() => setOpenAddDialog(true)}
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
          </Box>
        </Fade>
        </Container>
      </Box>

      {/* Add Video Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Adicionar Novo Vídeo</DialogTitle>
        <DialogContent>
          <TextField
            label="Título do Vídeo"
            fullWidth
            margin="normal"
            value={newVideoForm.title}
            onChange={(e) => setNewVideoForm({ ...newVideoForm, title: e.target.value })}
            placeholder="Ex: Show no Rock in Rio 2024"
          />
          
          <TextField
            label="URL do Vídeo"
            fullWidth
            margin="normal"
            value={newVideoForm.url}
            onChange={(e) => setNewVideoForm({ ...newVideoForm, url: e.target.value })}
            placeholder="https://www.youtube.com/embed/..."
          />
          
          <TextField
            label="Descrição"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={newVideoForm.description}
            onChange={(e) => setNewVideoForm({ ...newVideoForm, description: e.target.value })}
            placeholder="Descreva seu vídeo..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAddDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAddVideo}
            variant="contained"
            disabled={!newVideoForm.title.trim() || !newVideoForm.url.trim()}
          >
            Adicionar Vídeo
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyVideos;
