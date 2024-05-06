import { Box, Button, Grid, Input } from "@mui/material"
import Media from "./components/Media";
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import AddVideoModal from "./components/modal/AddVideoModal";
import { MediaApi, MediaDto } from "../../gen/api/src";
import ApiConfiguration from "../../apiConfig";
import Swal from "sweetalert2";

const Videos = () => {
  const mediaService = new MediaApi(ApiConfiguration);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState<MediaDto[]>([]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const search = () => {
    setSearchTerm('');
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const mediasResult = await mediaService.apiMediaGetMediaGet();;

        if (mediasResult.isSuccess) {
          setData(mediasResult.data!);
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

    fetchData();
  }
    , []);

  return (
    <>
      <AddVideoModal
        open={openModal}
        onClose={handleCloseModal}
      />
      <Box height="100vh" flex={1} bgcolor="#F3F3F3">
        <Box display="flex" pl={3.4} mt={5}>
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
          {data.map((item, index) => (
            <Media key={index} src={item.src!} title={item.title!} description={item.description!} nickname={item.nickname!} createdAt={new Date(item.creationTime!)} loading={loading} />
          ))}
        </Grid>
      </Box>
    </>
  )
}

export default Videos
