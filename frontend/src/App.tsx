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
          }
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
