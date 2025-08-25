import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Paper 
            elevation={8}
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #3c140c 0%, #2c0e08 100%)',
              color: 'white'
            }}
          >
            <ErrorOutline sx={{ fontSize: 80, color: '#ff6b6b', mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Ops! Algo deu errado
            </Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.8)" mb={4}>
              Ocorreu um erro inesperado. Por favor, recarregue a página ou tente novamente mais tarde.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={this.handleReload}
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
                }
              }}
            >
              Recarregar Página
            </Button>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
