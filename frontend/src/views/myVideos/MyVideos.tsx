import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Input, Paper, TablePagination, TextField, Typography } from "@mui/material"
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
      <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
        {userVideosData.data?.items?.length! > 0 && (
          <Paper elevation={4} sx={{ width: "80%" }}>
            <Box display="flex" justifyContent="end" m={1}>
              <Input value={searchTerm} placeholder="Pesquisa por título" sx={{ width: 460 }} onChange={handleInputChange} />
              <Button className="btn btn-primary" onClick={search}>
                <SearchIcon fontSize="medium" />
              </Button>
            </Box>
            {userVideosData.data?.items!.map((data) => (
              <Accordion expanded={expanded === `panel${data.id}`} onChange={handleChange(`panel${data.id}`)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${data.id}bh-content`}
                  id={`panel${data.id}bh-header`}
                >
                  <Typography fontWeight="bold" sx={{ width: '33%', flexShrink: 0 }}>
                    {data.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex">
                      <iframe width="360" height="200" src={data.url} title={data.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen style={{ border: "0px", borderRadius: "10px" }}></iframe>
                      <Divider orientation="vertical" flexItem sx={{ marginLeft: "16px" }} />
                      <Box display="flex" alignItems="center" ml={5} width="100vh">
                        <TextField
                          value={editIsActive ? descriptionEdit : data.description}
                          onChange={(e) => setDescriptionEdit(e.target.value)}
                          fullWidth
                          multiline
                          rows={6}
                          disabled={!editIsActive}
                        />
                      </Box>
                    </Box>
                    <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="center" height="100%">
                      <Button onClick={() => handleChangEditState(data)}>
                        {editIsActive ? 'Cancelar' : 'Editar'}
                      </Button>
                      {editIsActive ? (
                        <Button color="success" onClick={() => updateMediaById(descriptionEdit, data.id!)}>Salvar</Button>
                      ) : (
                        <Button sx={{ color: "red" }} onClick={() => deleteMediaById(data.id!)}>Excluir</Button>
                      )}
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
            <TablePagination
              sx={{ display: 'flex', justifyContent: 'center' }}
              rowsPerPageOptions={[12, 24, 48]}
              component="div"
              labelRowsPerPage="Vídeos por página"
              count={userVideosData.data!.totalCount!}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
        {userVideosData.data?.items?.length === 0 && (<Typography fontWeight="bold">Você ainda não possui nenhum vídeo, comece a postar! &#128512;</Typography>)}
      </Box>
    </>
  )
}

export default MyVideos
