import { useEffect, useState } from "react";
import CardPhoto from "./components/CardPhoto";
import { Box, Button, Grid, Input, TablePagination } from "@mui/material";
import AddNewPhotoModal from "./components/modal/AddNewPhotoModal";
import { PhotoApi, PhotoResponseDtoGenericList } from "../../gen/api/src";
import ApiConfiguration from "../../apiConfig";
import * as toastr from 'toastr';
import SearchIcon from '@mui/icons-material/Search';

const Photos = () => {
  const photoService = new PhotoApi(ApiConfiguration);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [photos, setPhotos] = useState<PhotoResponseDtoGenericList>({ items: [], totalCount: 0 });
  const [pagination, setPagination] = useState({ page: 0, pageSize: 12, pageCount: 0, search: '' });

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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const search = async () => {
    getPhotos();
  }

  const getPhotos = async () => {
    const result = await photoService.apiPhotoGetAllPhotosPost({
      pagination: {
        page: pagination.page + 1,
        pageSize: pagination.pageSize,
        pageCount: pagination.pageCount,
        search: pagination.search
      }
    });
    if (result.isSuccess) {
      setPhotos(result.data!);
    } else {
      toastr.error(result.message!, 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
    }
  };

  useEffect(() => {
    getPhotos();
  }, [pagination.page, pagination.pageSize])

  return (
    <>
      <AddNewPhotoModal open={openModal} onClose={handleCloseModal} />
      <Box bgcolor="#F3F3F3">
        <Box display="flex" justifyContent="space-between">
          <Box ml={2} width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Input value={pagination.search} placeholder="Pesquisa por título" size="small" sx={{ marginTop: "16px", width: "400px" }} onChange={(e) => setPagination({ ...pagination, search: e.target.value })} />
              <Button className="btn btn-primary" onClick={search}>
                <SearchIcon fontSize="medium" />
              </Button>
            </Box>
            <Box>
              <Button sx={{ marginTop: "16px" }} className="btn btn-primary" onClick={handleOpenModal}>
                Adicionar foto
              </Button>
            </Box>
          </Box>
        </Box>
        <Box m={2}>
          <Grid container spacing={2}>
            {photos.items?.map((photo, index) => (
              <Grid key={index} item xs={2}>
                <CardPhoto key={index} title={photo.title!} subtitle={photo.subtitle!} srcPhotoS3={photo.src!} date={photo.captureDate!}
                  description={photo.description} srcUserPhotoProfile={photo.avatarSrc} userId={photo.userId!} nickname={photo.nickname!} photoId={photo.id!} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <TablePagination
          sx={{ display: 'flex', justifyContent: 'center' }}
          rowsPerPageOptions={[12, 24, 48]}
          component="div"
          count={photos.totalCount!}
          labelRowsPerPage="Fotos por página"
          rowsPerPage={pagination.pageSize}
          page={pagination.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>
  )
}

export default Photos
