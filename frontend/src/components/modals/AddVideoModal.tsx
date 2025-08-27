import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { MediaApi } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';

interface AddVideoModalProps {
  open: boolean;
  onClose: () => void;
}

const AddVideoModal: React.FC<AddVideoModalProps> = ({ open, onClose }) => {
  const mediaService = new MediaApi(ApiConfiguration);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    url: '',
    description: ''
  });

  const handleInputChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.url.trim()) {
      alert('Por favor, preencha título e URL do vídeo.');
      return;
    }

    try {
      setLoading(true);
      const result = await mediaService.apiMediaRequestMediaPost({
        requestMediaDto: {
          src: form.url,
          title: form.title,
          description: form.description,
        }
      });

      if (result.isSuccess) {
        alert('Vídeo enviado para aprovação com sucesso!');
        setForm({ title: '', url: '', description: '' });
        onClose();
      } else {
        alert(`Erro: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Erro ao adicionar vídeo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ title: '', url: '', description: '' });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Adicionar Novo Vídeo
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            label="Título do Vídeo"
            fullWidth
            value={form.title}
            onChange={handleInputChange('title')}
            placeholder="Ex: Show no Rock in Rio 2024"
            disabled={loading}
          />
          
          <TextField
            label="URL do Vídeo"
            fullWidth
            value={form.url}
            onChange={handleInputChange('url')}
            placeholder="https://www.youtube.com/embed/..."
            disabled={loading}
          />
          
          <TextField
            label="Descrição"
            fullWidth
            multiline
            rows={4}
            value={form.description}
            onChange={handleInputChange('description')}
            placeholder="Descreva seu vídeo..."
            disabled={loading}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !form.title.trim() || !form.url.trim()}
          sx={{
            background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
            '&:hover': {
              background: 'linear-gradient(45deg, #b71c1c, #f44336)'
            }
          }}
        >
          {loading ? 'Enviando...' : 'Adicionar Vídeo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVideoModal;
