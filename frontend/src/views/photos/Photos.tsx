import { useState } from "react";
import CardPhoto from "./components/CardPhoto";
import { Box, Button, Grid } from "@mui/material";
import AddNewPhotoModal from "./components/modal/AddNewPhotoModal";

const Photos = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <AddNewPhotoModal open={openModal} onClose={handleCloseModal} />
      <Box>
        <Box m={1} display="flex" justifyContent="flex-end">
          <Button className="btn btn-primary" onClick={handleOpenModal}>
            Adicionar foto
          </Button>
        </Box>
        <Box m={2}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <CardPhoto key={1} title="Metal" subtitle="asasasasasasas" srcPhotoS3="" date={new Date()} description="sadfaaaaaaaaaaaaaaaaaaaaaaaaaasfesadgewgwebg" />
            </Grid>
            <Grid item xs={2}>
              <CardPhoto key={2} title="Metal" subtitle="Metal em 1986" srcPhotoS3="" date={new Date()} description="sadfaaaaaaaaaaaaaaaaaaaaaaaaaasfesadgewgwebg" />
            </Grid>
            <Grid item xs={2}>
              <CardPhoto key={3} title="Metal" subtitle="Metal em 1986" srcPhotoS3="" date={new Date()} description="sadfaaaaaaaaaaaaaaaaaaaaaaaaaasfesadgewgwebg" />
            </Grid>
            <Grid item xs={2}>
              <CardPhoto key={4} title="Metal" subtitle="Metal em 1986" srcPhotoS3="" date={new Date()} description="sadfaaaaaaaaaaaaaaaaaaaaaaaaaasfesadgewgwebg" />
            </Grid>
            <Grid item xs={2}>
              <CardPhoto key={5} title="Metal" subtitle="Metal em 1986" srcPhotoS3="" date={new Date()} description="sadfaaaaaaaaaaaaaaaaaaaaaaaaaasfesadgewgwebg" />
            </Grid>
            <Grid item xs={2}>
              <CardPhoto key={6} title="Metal" subtitle="Metal em 1986" srcPhotoS3="" date={new Date()} description="sadfaaaaaaaaaaaaaaaaaaaaaaaaaasfesadgewgwebg" />
            </Grid>
            <Grid item xs={2}>
              <CardPhoto key={7} title="Metal" subtitle="Metal em 1986" srcPhotoS3="" date={new Date()} description="Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32." />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default Photos
