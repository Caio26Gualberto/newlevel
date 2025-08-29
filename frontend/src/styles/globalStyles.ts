import { GlobalStyles } from '@mui/material';
import HeadbangerBackground from '../assets/HeadbangerBackground.jpg';
import Headbanger2 from '../assets/Headbanger2.jpeg';
import Slayer5 from '../assets/Slayer5.jpg';

export const globalStylesConfig = {
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
      'html, body': {
        height: '100%',
        fontFamily: "'RiotFont', 'Roboto', 'Arial', sans-serif",
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      '#root': {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
      // Espaçamento para evitar sobreposição da navbar fixa
      'main, .main-content': {
        paddingTop: '80px', // Altura da navbar + margem
        '@media (max-width: 600px)': {
          paddingTop: '70px', // Menor em mobile
        },
      },
      // Background classes para diferentes páginas
      '.image-with-opacity': {
        backgroundImage: `url(${HeadbangerBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        '@media (max-width: 600px)': {
          backgroundSize: 'cover',
          backgroundAttachment: 'scroll',
        },
      },
      '.image-with-opacity-bandRegister': {
        backgroundImage: `url(${Headbanger2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        '@media (max-width: 600px)': {
          backgroundSize: 'cover',
          backgroundAttachment: 'scroll',
        },
      },
      '.image-with-opacity-reset-password': {
        backgroundImage: `url(${Slayer5})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        '@media (max-width: 600px)': {
          backgroundSize: 'cover',
          backgroundAttachment: 'scroll',
        },
      },
      // Scrollbar personalizada
      '::-webkit-scrollbar': {
        width: '8px',
        '@media (max-width: 600px)': {
          width: '6px',
        },
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#d32f2f',
        borderRadius: '4px',
        '&:hover': {
          background: '#b71c1c',
        },
      },
      // Utilitários responsivos
      '.gradient-text': {
        background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      },
      '.responsive-container': {
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        '@media (max-width: 600px)': {
          padding: '0 8px',
        },
      },
      // Animações
      '@keyframes fadeIn': {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
      },
      '@keyframes slideIn': {
        from: { transform: 'translateX(-100%)' },
        to: { transform: 'translateX(0)' },
      },
      '.fade-in': {
        animation: 'fadeIn 0.6s ease-out',
      },
      '.slide-in': {
        animation: 'slideIn 0.4s ease-out',
      },
};

export default globalStylesConfig;
