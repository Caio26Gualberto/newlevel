import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, IconButton, TablePagination, TextField, ThemeProvider, Typography, createTheme } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from "react";
import { MediaApi, MediaDtoGenericList } from "../../../gen/api/src";
import ApiConfiguration from "../../../apiConfig";
import * as toastr from 'toastr';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import NewLevelLoading from "../../../components/NewLevelLoading";

const styles = {
  textField: {
    maxHeight: '200px', // Ajuste a altura máxima conforme necessário
    overflow: 'auto',
    cursor: 'default', // Define o cursor padrão para o campo
    '& .MuiInputBaseInput': {
      cursor: 'default', // Define o cursor padrão para o conteúdo do campo
    },
  },
};

const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          cursor: 'default', // Define o cursor padrão
          '&:hover': {
            cursor: 'default', // Define o cursor padrão ao passar o mouse
          },
        },
      },
    },
  },
});

const VideoRequest = () => {
  const mediaService = new MediaApi(ApiConfiguration);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [videosToApprove, setVideosToApprove] = useState<MediaDtoGenericList>({ items: [], totalCount: 0 });
  const [pagination, setPagination] = useState({ page: 0, pageSize: 12, pageCount: 0, search: "" });

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
    setLoading(true)
    const mediaService = new MediaApi(ApiConfiguration);
    const result = await mediaService.apiMediaApproveMediaGet({ mediaId: id, isApprove: true });

    if (!result.isSuccess) {
      toastr.error(result.message!, 'Erro', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
    } else {
      toastr.success(result.message!, 'Sucesso', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
    }

    searchMedia()
    setLoading(false)
  }

  const searchMedia = async () => {
    setLoading(true)
    const result = await mediaService.apiMediaGetMediaToApprovePost({
      pagination: {
        page: pagination.page + 1,
        pageSize: pagination.pageSize,
        pageCount: pagination.pageCount,
        search: "",
      }
    });

    if (!result.isSuccess) {
      toastr.error(result.message!, 'Erro', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
    }
    setVideosToApprove(result.data!)
    setLoading(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      await searchMedia()
    }

    fetchData()
  }, [pagination.page, pagination.pageSize])

  return (
    <>
      <NewLevelLoading isLoading={loading} />
      <Box display="flex" flexDirection="column" justifyContent="center">
        {videosToApprove.items!.map((video, index) => (
          <Accordion expanded={expanded === `panel${video.id}`} onChange={handleChange(`panel${video.id}`)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${video.id}bh-content`}
              id={`panel${video.id}bh-header`}
            >
              <Typography fontWeight="bold" sx={{ width: '33%', flexShrink: 0 }}>
                {video.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Box display="flex">
                  <iframe width="360" height="200" src={video.src} title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin" allowFullScreen style={{ border: "0px", borderRadius: "10px" }}></iframe>
                  <Divider orientation="vertical" flexItem sx={{ marginLeft: "16px" }} />
                  <Box display="flex" alignItems="center" ml={3} width="55%">
                    <ThemeProvider theme={theme}>
                      <TextField
                        value={video.description}
                        fullWidth
                        multiline
                        rows={6}
                        inputProps={{ readOnly: true }}
                        style={styles.textField}
                      />
                    </ThemeProvider>
                  </Box>
                  <Box pl={5} pt={1} pb={1} display="flex" flexDirection="column" justifyContent="space-between" alignItems="center">
                    <IconButton onClick={() => acceptVideo(video.id!)}><CheckCircleIcon color="success" fontSize={"large"} /></IconButton>
                    <IconButton><BlockIcon color="error" fontSize={"large"} /></IconButton>
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
        {videosToApprove.items!.length === 0 && !loading && <Typography variant="h6" textAlign="center">Nenhum vídeo para aprovar</Typography>}
        {videosToApprove.items!.length > 0 &&
          <TablePagination
            sx={{ display: 'flex', justifyContent: 'center' }}
            rowsPerPageOptions={[12, 24, 48]}
            component="div"
            labelRowsPerPage="Vídeos por página"
            count={videosToApprove.totalCount!}
            rowsPerPage={pagination.pageSize}
            page={pagination.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        }
      </Box>
    </>
  )
}

export default VideoRequest
