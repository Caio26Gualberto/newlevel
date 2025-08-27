import React from 'react';
import {
  Box,
  TextField,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { BandMember } from './AddMembersModal';

interface DynamicRowProps {
  member: BandMember;
  onDelete: (id: string) => void;
}

const DynamicRow: React.FC<DynamicRowProps> = ({ member, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
        mb: 1,
        flexDirection: {
          xs: 'column',
          sm: 'row'
        }
      }}
    >
      <TextField
        label="Nome do Integrante"
        value={member.name}
        fullWidth
        variant="outlined"
        size={isSmallMobile ? 'small' : 'medium'}
        disabled
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
        value={member.instrument}
        fullWidth
        variant="outlined"
        size={isSmallMobile ? 'small' : 'medium'}
        disabled
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
        onClick={() => onDelete(member.id)}
        color="error"
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
          }
        }}
      >
        <Delete />
      </IconButton>
    </Box>
  );
};

export default DynamicRow;
