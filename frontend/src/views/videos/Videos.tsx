import { Box, Button, Grid, Input } from "@mui/material"
import Media from "./components/Media";
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import AddVideoModal from "./components/modal/AddVideoModal";

const data = [
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    views: '396k views',
    createdAt: 'a week ago',
  },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    views: '40M views',
    createdAt: '3 years ago',
  },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    createdAt: '10 months ago',
  },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    createdAt: '10 months ago',
  },
  {
    src: 'https://www.youtube.com/embed/BkCpGWMwcSA',
    title: 'Valorant',
    createdAt: '10 months ago',
  },
  // {
  //   src: 'https://www.youtube.com/embed/q2I0ulTZWXA',
  //   title: 'Scream Aim Fire (Official Video)',
  //   createdAt: '10 months ago',
  // },
  // {
  //   src: 'https://www.youtube.com/embed/q2I0ulTZWXA',
  //   title: 'Scream Aim Fire (Official Video)',   
  //   createdAt: '10 months ago',
  // },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    createdAt: '10 months ago',
  },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    createdAt: '10 months ago',
  },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    createdAt: '10 months ago',
  },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    createdAt: '10 months ago',
  },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    createdAt: '10 months ago',
  },
];


const Videos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data here
    }

    fetchData();
  }, []);

  const search = () => {
    setSearchTerm('');
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  return (
    <>
      <AddVideoModal
        open={openModal}
        onClose={handleCloseModal}
      />
      <Box height="100%" bgcolor="#F3F3F3">
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
            <Media key={index} src={item.src} title={item.title} createdAt={item.createdAt} loading={loading} />
          ))}
        </Grid>
      </Box>
    </>
  )
}

export default Videos
