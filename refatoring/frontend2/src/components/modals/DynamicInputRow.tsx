import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add } from '@mui/icons-material';

interface DynamicInputRowProps {
  onAddMember: (name: string, instrument: string) => void;
}

const DynamicInputRow: React.FC<DynamicInputRowProps> = ({ onAddMember }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [name, setName] = useState('');
  const [instrument, setInstrument] = useState('');

  const handleAdd = () => {
    if (name.trim() && instrument.trim()) {
      onAddMember(name.trim(), instrument.trim());
      setName('');
      setInstrument('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
        flexDirection: {
          xs: 'column',
          sm: 'row'
        }
      }}
    >
      <TextField
        label="Nome do Integrante"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={handleKeyPress}
        fullWidth
        variant="outlined"
        size={isSmallMobile ? 'small' : 'medium'}
        sx={{
          '& .MuiInputBase-input': {
            fontSize: {
              xs: '0.875rem',
              sm: '1rem'
            }
          },
          '& .MuiInputLabel-root': {
            fontSize: {
              xs: '0.875rem',
              sm: '1rem'
            }
          }
        }}
      />
      
      <TextField
        label="Instrumento"
        value={instrument}
        onChange={(e) => setInstrument(e.target.value)}
        onKeyPress={handleKeyPress}
        fullWidth
        variant="outlined"
        size={isSmallMobile ? 'small' : 'medium'}
        sx={{
          '& .MuiInputBase-input': {
            fontSize: {
              xs: '0.875rem',
              sm: '1rem'
            }
          },
          '& .MuiInputLabel-root': {
            fontSize: {
              xs: '0.875rem',
              sm: '1rem'
            }
          }
        }}
      />
      
      <IconButton
        onClick={handleAdd}
        disabled={!name.trim() || !instrument.trim()}
        color="primary"
        sx={{
          mt: {
            xs: 0,
            sm: 0.5
          },
          minWidth: {
            xs: '48px',
            sm: '56px'
          },
          height: {
            xs: '48px',
            sm: '56px'
          },
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark'
          },
          '&:disabled': {
            bgcolor: 'action.disabled',
            color: 'action.disabled'
          }
        }}
      >
        <Add />
      </IconButton>
    </Box>
  );
};

export default DynamicInputRow;
