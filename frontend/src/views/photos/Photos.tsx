import { useEffect, useState } from "react";
import CardPhoto from "./components/CardPhoto";
import { Box, Button, Input, TablePagination, useTheme, useMediaQuery } from "@mui/material";
import AddNewPhotoModal from "./components/modal/AddNewPhotoModal";
import { PhotoApi, PhotoResponseDtoGenericList } from "../../gen/api/src";
import ApiConfiguration from "../../apiConfig";
import * as toastr from 'toastr';
import SearchIcon from '@mui/icons-material/Search';

const Photos = () => {
  const photoService = new PhotoApi(ApiConfiguration);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
      <Box 
        bgcolor="#F3F3F3"
        sx={{
          minHeight: '100vh',
          p: {
            xs: 2,
            sm: 3,
            md: 4
          }
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row"
            },
            alignItems: {
              xs: "stretch",
              md: "center"
            },
            justifyContent: "space-between",
            gap: {
              xs: 2,
              md: 0
            },
            mb: {
              xs: 3,
              md: 4
            }
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
              alignItems: {
                xs: "stretch",
                sm: "center"
              },
              gap: {
                xs: 1,
                sm: 1
              },
              flex: 1,
              maxWidth: {
                xs: "100%",
                md: "400px"
              }
            }}
          >
            <Input
              value={pagination.search}
              placeholder="Pesquisa por título"
              size="small"
              sx={{
                flex: 1,
                minWidth: 0
              }}
              onChange={(e) => setPagination({ ...pagination, search: e.target.value })}
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

          {/* Add Photo Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: {
                xs: "stretch",
                md: "flex-end"
              }
            }}
          >
            <Button
              sx={{
                width: {
                  xs: "100%",
                  md: "auto"
                }
              }}
              className="btn btn-primary"
              onClick={handleOpenModal}
            >
              Adicionar foto
            </Button>
          </Box>
        </Box>

        {/* Photos Grid */}
        <Box 
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: {
              xs: 1,
              sm: 2,
              md: 3
            },
            justifyContent: {
              xs: "center",
              sm: "flex-start"
            },
            mb: 3
          }}
        >
          {photos.items?.map((photo, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 8px)",
                  md: "1 1 calc(33.333% - 16px)",
                  lg: "1 1 calc(25% - 24px)",
                  xl: "1 1 calc(20% - 24px)"
                },
                minWidth: {
                  xs: "100%",
                  sm: "280px",
                  md: "300px"
                },
                maxWidth: {
                  xs: "100%",
                  sm: "400px",
                  md: "500px"
                }
              }}
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
            </Box>
          ))}
        </Box>

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
            count={photos.totalCount!}
            labelRowsPerPage="Fotos por página"
            rowsPerPage={pagination.pageSize}
            page={pagination.page}
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
      </Box>
    </>
  );
}

export default Photos
