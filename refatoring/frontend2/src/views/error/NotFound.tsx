import React from 'react';
import { Box, Typography, Button, Paper, Container, Stack } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={8}
        sx={{ 
          p: { xs: 4, sm: 6 }, 
          textAlign: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #3c140c 0%, #2c0e08 100%)',
          color: 'white'
        }}
      >
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '4rem', sm: '6rem', md: '8rem' },
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ff6b6b 30%, #d32f2f 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2
          }}
        >
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Página não encontrada
        </Typography>
        
        <Typography 
          variant="body1" 
          color="rgba(255,255,255,0.8)" 
          mb={4}
          sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}
        >
          A página que você está procurando não existe ou foi movida.
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center"
        >
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
              }
            }}
          >
            Voltar
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={() => navigate('/videos')}
            size="large"
            sx={{
              borderColor: '#ff6b6b',
              color: '#ff6b6b',
              '&:hover': {
                borderColor: '#d32f2f',
                backgroundColor: 'rgba(255, 107, 107, 0.1)'
              }
            }}
          >
            Ir para Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default NotFound;
