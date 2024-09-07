import { useEffect, useState } from "react";
import CardPhoto from "./components/CardPhoto";
import { Box, Button, Grid, Input, TablePagination } from "@mui/material";
import AddNewPhotoModal from "./components/modal/AddNewPhotoModal";
import { PhotoApi, PhotoResponseDtoGenericList } from "../../gen/api/src";
import ApiConfiguration from "../../apiConfig";
import * as toastr from 'toastr';
import SearchIcon from '@mui/icons-material/Search';
import { useMobile } from "../../MobileContext";

const Photos = () => {
  const photoService = new PhotoApi(ApiConfiguration);
  const { isMobile } = useMobile()
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
        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          alignItems="center"
          justifyContent="space-between"
          padding={isMobile ? 2 : 3}
        >
          <Box
            width={isMobile ? '100%' : 'auto'}
            display="flex"
            alignItems="center"
            justifyContent={isMobile ? 'space-between' : 'flex-start'}
            mb={isMobile ? 2 : 0}
          >
            <Input
              value={pagination.search}
              placeholder="Pesquisa por título"
              size="small"
              sx={{
                width: isMobile ? '100%' : '400px',
                marginTop: isMobile ? 1 : 2,
              }}
              onChange={(e) => setPagination({ ...pagination, search: e.target.value })}
            />
            <Button
              className="btn btn-primary"
              onClick={search}
              sx={{ ml: isMobile ? 0 : 1, mt: isMobile ? 1 : 0 }}
            >
              <SearchIcon fontSize="medium" />
            </Button>
          </Box>
          <Button
            sx={{
              width: isMobile ? '100%' : 'auto',
              mt: isMobile ? 1 : 2,
            }}
            className="btn btn-primary"
            onClick={handleOpenModal}
          >
            Adicionar foto
          </Button>
        </Box>
        <Box m={isMobile ? 1 : 2}>
          <Grid container spacing={isMobile ? 1 : 2}>
            {photos.items?.map((photo, index) => (
              <Grid
                key={index}
                item
                xs={12}
                sm={6} 
                md={4} 
                lg={2} 
              >
                <CardPhoto
                  title={photo.title!}
                  subtitle={photo.subtitle!}
                  srcPhotoS3={photo.src!}
                  date={photo.captureDate!}
                  description={photo.description}
                  srcUserPhotoProfile={photo.avatarSrc}
                  userId={photo.userId!}
                  nickname={photo.nickname!}
                  photoId={photo.id!}
                />
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
  );

}

export default Photos
