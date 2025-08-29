import { createTheme, ThemeOptions } from '@mui/material/styles';

// Definindo as cores do tema baseadas na identidade visual
const colors = {
  primary: {
    main: '#d32f2f',
    light: '#ff6b6b',
    dark: '#b71c1c',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#000000',
    light: '#424242',
    dark: '#000000',
    contrastText: '#ffffff',
  },
  background: {
    default: '#F3F3F3',
    paper: '#ffffff',
    dark: '#3c140c',
  },
  text: {
    primary: '#000000',
    secondary: '#666666',
    light: '#ffffff',
  },
};

// Configuração do tema responsivo
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
  },
  typography: {
    fontFamily: "'RiotFont', 'Roboto', 'Arial', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1.125rem',
      },
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    body1: {
      fontSize: '1rem',
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
    },
    body2: {
      fontSize: '0.875rem',
      '@media (max-width:600px)': {
        fontSize: '0.75rem',
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          transition: 'all 1s ease-in-out',
          '@media (max-width:600px)': {
            padding: '6px 12px',
            fontSize: '0.875rem',
          },
          '&:disabled': {
            backgroundColor: 'transparent !important',
            color: 'rgba(255, 255, 255, 0.3) !important',
            border: '1px solid rgba(255, 255, 255, 0.12) !important',
            boxShadow: 'none !important',
            opacity: 0.6,
            transition: 'all 0.4s ease-in-out',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)',
          background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.4)',
            background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
            transform: 'translateY(-1px)',
          },
          '&:not(:disabled)': {
            animation: 'fadeInButton 0.4s ease-in-out',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          color: '#ffffff',
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);

export default theme;
