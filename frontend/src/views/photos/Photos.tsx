import { useState } from "react";
import CardPhoto from "./components/CardPhoto";
import { Box, Grid } from "@mui/material";

const Photos = () => {

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debugger
    const files = event.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (selectedImage) {
      try {
        debugger
        const response = await fetch('URL_PARA_O_SEU_BACKEND', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: selectedImage }),
        });
        if (response.ok) {
          console.log('Imagem enviada com sucesso!');
        } else {
          console.error('Erro ao enviar imagem:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao enviar imagem:', error);
      }
    }
  };

  return (
    <Box>
      <div>
        <h2>Upload de Imagem</h2>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleUploadImage}>Enviar Imagem</button>
      </div>
      <Box m={2}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <CardPhoto />
          </Grid>
          <Grid item xs={2}>
            <CardPhoto />
          </Grid>
          <Grid item xs={2}>
            <CardPhoto />
          </Grid>
          <Grid item xs={2}>
            <CardPhoto />
          </Grid>
          <Grid item xs={2}>
            <CardPhoto />
          </Grid>
          <Grid item xs={2}>
            <CardPhoto />
          </Grid>
          <Grid item xs={2}>
            <CardPhoto />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Photos
