import { Avatar, Box, Button, Card, CardContent, Paper, Typography } from '@mui/material'
import React from 'react'
import Logo from "../../assets/Headbanger4.jpeg"

const Profile = () => {
  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column" alignItems="center">
      <Paper elevation={10} sx={{ height: "45vh", width: "70%", position: "relative", mb: 2, boxShadow: 0 }}>
        <img
          src={Logo}
          alt="Banner"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // Ajusta a imagem para cobrir o contêiner
            objectPosition: "center", // Centraliza a imagem no contêiner
            borderRadius: "4px", // Adiciona bordas arredondadas apenas no topo
          }}
        />
        <Box position="absolute" left="50px" bottom="-100px">
          <Avatar
            src={Logo}
            alt="Profile"
            style={{
              width: "200px",
              height: "200px",
              border: "3px solid #fff",
            }}
          />
        </Box>
      </Paper>
      <Paper elevation={10} sx={{ width: "70%", p: 2, m: -1.9 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" pl="20%">
          <Box>
            <Typography variant="h4">Caio</Typography>
            <Typography variant="subtitle1">Santo André</Typography>
          </Box>
          <Box>
            <Typography variant="h6">Palios From Hell</Typography>
          </Box>
        </Box>
        <Box mt={3}>
          <Typography>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
            into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </Typography>
          <Typography>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
            into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </Typography>
          <Typography>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
            into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Profile