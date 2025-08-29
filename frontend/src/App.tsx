import React from 'react';
import { Container, GlobalStyles } from '@mui/material';
import Routes from './routes/Routes';

function App() {
  return (
    <>
      <GlobalStyles
        styles={{
          '.swal2-container': {
            zIndex: '9999 !important',
          },
          '.swal2-popup': {
            zIndex: '9999 !important',
          },
          '@keyframes fadeInButton': {
            '0%': {
              opacity: 0.6,
              transform: 'scale(0.95)',
            },
            '100%': {
              opacity: 1,
              transform: 'scale(1)',
            },
          },
        }}
      />
      <Container 
        maxWidth={false} 
        disableGutters 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Routes />
      </Container>
    </>
  );
}

export default App;
