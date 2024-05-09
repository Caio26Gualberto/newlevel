import { Box, Button, Grid, Input, TablePagination } from "@mui/material"
import Media from "./components/Media";
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import AddVideoModal from "./components/modal/AddVideoModal";
import { MediaApi, MediaDtoGenericListNewLevelResponse } from "../../gen/api/src";
import ApiConfiguration from "../../apiConfig";
import Swal from "sweetalert2";

const Videos = () => {
  const mediaService = new MediaApi(ApiConfiguration);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState<MediaDtoGenericListNewLevelResponse>({ data: { items: [], totalCount: 0 }, isSuccess: false, message: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const search = () => {
    searchMedia();
    setSearchTerm('');
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  const searchMedia = async () => {
    try {
      setLoading(true);
      const mediasResult = await mediaService.apiMediaGetMediaPost({
        pagination: {
          page: page + 1,
          pageSize: rowsPerPage,
          pageCount: 0,
          search: searchTerm
        }
      });;

      if (mediasResult.isSuccess) {
        setData(mediasResult);
      } else {
        Swal.fire({
          title: 'Erro',
          text: mediasResult.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }

    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await searchMedia();
    }

    fetchData();
  }
    , [page, rowsPerPage]);

  return (
    <>
      <AddVideoModal
        open={openModal}
        onClose={handleCloseModal}
      />
      <Box height="100%" flex={1} bgcolor="#F3F3F3">
        <Box display="flex" pl={3.4} pt={2}>
          <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" mr={1}>
            <Box>
              <Input value={searchTerm} placeholder="Pesquisa por título" sx={{ width: 460 }} onChange={handleInputChange} />
              <Button className="btn btn-primary" onClick={search}>
                <SearchIcon fontSize="medium" />
              </Button>
            </Box>
            <Box>
              <Button className="btn btn-primary" onClick={handleOpenModal}>
                Adicionar vídeo
              </Button>
            </Box>
          </Box>
        </Box>
        <Grid container pl={3.4}>
          {data.data?.items!.map((item, index) => (
            <Media key={index} src={item.src!} title={item.title!} description={item.description!} nickname={item.nickname!} createdAt={new Date(item.creationTime!)} loading={loading} />
          ))}
        </Grid>
        <TablePagination
          sx={{ display: 'flex', justifyContent: 'center' }}
          rowsPerPageOptions={[12, 24, 48]}
          component="div"
          count={data.data!.totalCount!}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>
  )
}

export default Videos
