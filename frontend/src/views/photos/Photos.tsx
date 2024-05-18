import { useEffect, useState } from "react";
import CardPhoto from "./components/CardPhoto";
import { Box, Button, Grid, TablePagination } from "@mui/material";
import AddNewPhotoModal from "./components/modal/AddNewPhotoModal";
import { PhotoApi, PhotoResponseDtoGenericList } from "../../gen/api/src";
import ApiConfiguration from "../../apiConfig";
import * as toastr from 'toastr';

const Photos = () => {
  const photoService = new PhotoApi(ApiConfiguration);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [photos, setPhotos] = useState<PhotoResponseDtoGenericList>({ items: [], totalCount: 0 });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 12, pageCount: 0, search: '' });

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
        <Box display="flex" justifyContent="flex-end">
          <Button sx={{ marginTop: "16px" }} className="btn btn-primary" onClick={handleOpenModal}>
            Adicionar foto
          </Button>
        </Box>
        <Box m={2}>
          <Grid container spacing={2}>
            {photos.items?.map((photo, index) => (
              <Grid item xs={2}>
                <CardPhoto key={index} title={photo.title!} subtitle={photo.subtitle!} srcPhotoS3={photo.src!} date={photo.captureDate!} description={photo.description} srcUserPhotoProfile={photo.avatarSrc} />
              </Grid>
            ))}
          </Grid>
        </Box>
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
    </>
  )
}

export default Photos
