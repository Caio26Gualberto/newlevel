import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Close } from '@mui/icons-material';
import DynamicInputRow from './DynamicInputRow';
import DynamicRow from './DynamicRow';

export interface BandMember {
  id: string;
  name: string;
  instrument: string;
}

interface AddMembersModalProps {
  open: boolean;
  onClose: () => void;
  onSaveMembers: (members: BandMember[]) => void;
  initialMembers?: BandMember[];
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({ 
  open, 
  onClose, 
  onSaveMembers,
  initialMembers = []
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [members, setMembers] = useState<BandMember[]>(initialMembers);

  const generateId = (): string => {
    return `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddMember = (name: string, instrument: string) => {
    const newMember: BandMember = {
      id: generateId(),
      name,
      instrument
    };
    setMembers(prev => [...prev, newMember]);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const handleSave = () => {
    onSaveMembers(members);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isSmallMobile}
      PaperProps={{
        sx: {
          borderRadius: isSmallMobile ? 0 : 2,
          minHeight: '400px'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}
      >
        <Typography 
          variant="h6" 
          component="h2"
          sx={{
            fontSize: {
              xs: '1.1rem',
              sm: '1.25rem'
            },
            fontWeight: 'bold'
          }}
        >
          Integrantes da Banda
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minHeight: '300px'
          }}
        >
          {members.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Membros adicionados:
              </Typography>
              {members.map((member) => (
                <DynamicRow
                  key={member.id}
                  member={member}
                  onDelete={handleDeleteMember}
                />
              ))}
            </Box>
          )}
          
          <Box>
            <Typography 
              variant="subtitle2" 
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Adicionar novo membro:
            </Typography>
            <DynamicInputRow onAddMember={handleAddMember} />
          </Box>
        </Box>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: { xs: 2, sm: 3 }, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{
            fontSize: {
              xs: '0.875rem',
              sm: '1rem'
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          color="primary"
          sx={{
            fontSize: {
              xs: '0.875rem',
              sm: '1rem'
            }
          }}
        >
          Salvar Membros
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMembersModal;
