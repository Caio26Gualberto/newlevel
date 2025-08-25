import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Input, Paper, TablePagination, TextField, Typography, useTheme, useMediaQuery } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect } from "react";
import { MediaApi, MediaByUserIdDto, MediaByUserIdDtoGenericListNewLevelResponse } from "../../gen/api/src";
import SearchIcon from '@mui/icons-material/Search';
import ApiConfiguration from "../../apiConfig";
import * as toastr from 'toastr';
import NewLevelLoading from "../../components/NewLevelLoading";
import Swal from "sweetalert2";

const MyVideos = () => {
  const mediaApi = new MediaApi(ApiConfiguration);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [descriptionEdit, setDescriptionEdit] = React.useState("");
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [editIsActive, setEditIsActive] = React.useState<boolean>(false);
  const [userVideosData, setUserVideosData] = React.useState<MediaByUserIdDtoGenericListNewLevelResponse>({ data: { items: [], totalCount: 0 }, isSuccess: false, message: "" });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const search = () => {
    fetchUserVideos();
    setSearchTerm('');
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  const handleChangEditState = (data: MediaByUserIdDto) => {
    // Inicializa o estado descriptionEdit com a descrição atual
    setDescriptionEdit(data.description!);
    setEditIsActive(!editIsActive);
  }

  const deleteMediaById = async (mediaId: number) => {
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
        toastr.success(media.message!, 'OK', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
      } else {
        toastr.error(media.message!, 'Erro', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
      }
    } catch (error) {

    } finally {
      setEditIsActive(false);
      setLoading(false);
    }
  }

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
                }
              }
              return item;
            })
          }
        });
        toastr.success(media.message!, 'OK', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
      } else {
        toastr.error(media.message!, 'Erro', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
      }
    } catch (error) {

    } finally {
      setEditIsActive(false);
      setLoading(false)
    }
  }

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
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
        Swal.fire({
          title: 'Erro',
          text: userVideos.message!,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserVideos();
    }

    fetchData();
  }, [page, rowsPerPage]);

  return (
    <>
      <NewLevelLoading isLoading={loading} />
      <Box 
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: {
            xs: 2,
            sm: 3,
            md: 4
          }
        }}
      >
        {userVideosData.data?.items?.length! > 0 && (
          <Paper 
            elevation={4} 
            sx={{ 
              width: {
                xs: "100%",
                sm: "90%",
                md: "80%"
              },
              maxWidth: "1200px"
            }}
          >
            {/* Search Section */}
            <Box 
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row"
                },
                justifyContent: "end",
                alignItems: {
                  xs: "stretch",
                  sm: "center"
                },
                gap: 1,
                m: 1
              }}
            >
              <Input 
                value={searchTerm} 
                placeholder="Pesquisa por título" 
                sx={{ 
                  width: {
                    xs: "100%",
                    sm: "460px"
                  }
                }} 
                onChange={handleInputChange} 
              />
              <Button 
                className="btn btn-primary" 
                onClick={search}
                sx={{
                  minWidth: "fit-content",
                  alignSelf: {
                    xs: "stretch",
                    sm: "center"
                  }
                }}
              >
                <SearchIcon fontSize="medium" />
              </Button>
            </Box>

            {/* Videos List */}
            {userVideosData.data?.items!.map((data) => (
              <Accordion 
                key={data.id}
                expanded={expanded === `panel${data.id}`} 
                onChange={handleChange(`panel${data.id}`)}
                sx={{
                  mb: 1
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${data.id}bh-content`}
                  id={`panel${data.id}bh-header`}
                >
                  <Typography 
                    fontWeight="bold" 
                    sx={{ 
                      width: {
                        xs: '100%',
                        sm: '50%',
                        md: '33%'
                      },
                      flexShrink: 0,
                      fontSize: {
                        xs: "0.875rem",
                        sm: "1rem"
                      }
                    }}
                  >
                    {data.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box 
                    sx={{
                      display: "flex",
                      flexDirection: {
                        xs: "column",
                        md: "row"
                      },
                      justifyContent: "space-between",
                      alignItems: {
                        xs: "stretch",
                        md: "center"
                      },
                      gap: {
                        xs: 2,
                        md: 3
                      }
                    }}
                  >
                    {/* Video and Description */}
                    <Box 
                      sx={{
                        display: "flex",
                        flexDirection: {
                          xs: "column",
                          lg: "row"
                        },
                        flex: 1,
                        gap: {
                          xs: 2,
                          lg: 3
                        }
                      }}
                    >
                      {/* Video Iframe */}
                      <Box
                        sx={{
                          width: "100%",
                          position: "relative",
                          paddingTop: "56.25%", // 16:9 aspect ratio
                          borderRadius: "10px",
                          overflow: "hidden"
                        }}
                      >
                        <iframe 
                          src={data.url} 
                          title={data.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin" 
                          allowFullScreen 
                          style={{ 
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: "0px", 
                            borderRadius: "10px" 
                          }}
                        />
                      </Box>

                      {/* Divider */}
                      <Box
                        sx={{
                          display: {
                            xs: "none",
                            lg: "block"
                          }
                        }}
                      >
                        <Divider orientation="vertical" flexItem />
                      </Box>

                      {/* Description TextField */}
                      <Box 
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flex: 1,
                          minWidth: 0
                        }}
                      >
                        <TextField
                          value={editIsActive ? descriptionEdit : data.description}
                          onChange={(e) => setDescriptionEdit(e.target.value)}
                          fullWidth
                          multiline
                          rows={isSmallMobile ? 4 : 6}
                          disabled={!editIsActive}
                          sx={{
                            '& .MuiInputBase-input': {
                              fontSize: {
                                xs: '0.875rem',
                                sm: '1rem'
                              }
                            }
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box 
                      sx={{
                        display: "flex",
                        flexDirection: {
                          xs: "row",
                          md: "column"
                        },
                        justifyContent: {
                          xs: "space-between",
                          md: "space-around"
                        },
                        alignItems: "center",
                        gap: 1,
                        minWidth: {
                          xs: "100%",
                          md: "auto"
                        }
                      }}
                    >
                      <Button 
                        onClick={() => handleChangEditState(data)}
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.875rem"
                          }
                        }}
                      >
                        {editIsActive ? 'Cancelar' : 'Editar'}
                      </Button>
                      {editIsActive ? (
                        <Button 
                          color="success" 
                          onClick={() => updateMediaById(descriptionEdit, data.id!)}
                          sx={{
                            fontSize: {
                              xs: "0.75rem",
                              sm: "0.875rem"
                            }
                          }}
                        >
                          Salvar
                        </Button>
                      ) : (
                        <Button 
                          sx={{ 
                            color: "red",
                            fontSize: {
                              xs: "0.75rem",
                              sm: "0.875rem"
                            }
                          }} 
                          onClick={() => deleteMediaById(data.id!)}
                        >
                          Excluir
                        </Button>
                      )}
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}

            {/* Pagination */}
            <Box 
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%"
              }}
            >
              <TablePagination
                rowsPerPageOptions={[12, 24, 48]}
                component="div"
                labelRowsPerPage="Vídeos por página"
                count={userVideosData.data!.totalCount!}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                    fontSize: {
                      xs: '0.75rem',
                      sm: '0.875rem'
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        )}
        {userVideosData.data?.items?.length === 0 && (
          <Typography 
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.25rem",
                md: "1.5rem"
              },
              textAlign: "center"
            }}
          >
            Você ainda não possui nenhum vídeo, comece a postar! &#128512;
          </Typography>
        )}
      </Box>
    </>
  )
}

export default MyVideos
