import { Box, Button, Input, TablePagination, useTheme, useMediaQuery } from "@mui/material"
import Media from "./components/Media";
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import AddVideoModal from "./components/modal/AddVideoModal";
import { MediaApi, MediaDtoGenericListNewLevelResponse } from "../../gen/api/src";
import ApiConfiguration from "../../apiConfig";
import Swal from "sweetalert2";
import NewLevelLoading from "../../components/NewLevelLoading";

const Videos = () => {
  const mediaService = new MediaApi(ApiConfiguration);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState<MediaDtoGenericListNewLevelResponse>({ data: { items: [], totalCount: 0 }, isSuccess: false, message: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      <NewLevelLoading isLoading={loading} />
      <AddVideoModal open={openModal} onClose={handleCloseModal} />
      <Box 
        sx={{
          height: "100%",
          flex: 1,
          bgcolor: "#F3F3F3",
          p: {
            xs: 1,
            sm: 2,
            md: 3
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
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              md: "center"
            },
            gap: {
              xs: 2,
              md: 0
            },
            mb: {
              xs: 2,
              md: 3
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
                md: "460px"
              }
            }}
          >
            <Input
              value={searchTerm}
              placeholder="Pesquisa por título"
              sx={{ 
                flex: 1,
                minWidth: 0
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

          {/* Add Video Button */}
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
              className="btn btn-primary" 
              onClick={handleOpenModal}
              sx={{
                width: {
                  xs: "100%",
                  md: "auto"
                }
              }}
            >
              Adicionar vídeo
            </Button>
          </Box>
        </Box>

        {/* Videos Grid */}
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
          {data.data?.items!.map((item, index) => (
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
                  md: "460px"
                }
              }}
            >
              <Media
                id={item.id!}
                src={item.src!}
                title={item.title!}
                description={item.description!}
                nickname={item.nickname!}
                createdAt={new Date(item.creationTime!)}
                loading={loading}
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
            count={data.data!.totalCount!}
            labelRowsPerPage="Vídeos por página"
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
      </Box>
    </>
  );
}

export default Videos
