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
import { PhotoApi } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';

interface AddPhotoModalProps {
  open: boolean;
  onClose: () => void;
}

const AddPhotoModal: React.FC<AddPhotoModalProps> = ({ open, onClose }) => {
  const photoService = new PhotoApi(ApiConfiguration);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    date: ''
  });

  const handleInputChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove non-numeric characters
    value = value.replace(/\D/g, '');
    
    // Limit to 8 characters
    if (value.length > 8) {
      value = value.substr(0, 8);
    }
    
    // Apply dd/MM/yyyy mask
    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (value.length > 5) {
      value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }
    
    setForm(prev => ({ ...prev, date: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert('Por favor, insira um título para a foto.');
      return;
    }
    
    if (!selectedFile) {
      alert('Por favor, selecione uma imagem.');
      return;
    }

    try {
      setLoading(true);
      
      // Parse date or use current date
      let dateObject = new Date();
      if (form.date) {
        const [day, month, year] = form.date.split('/').map(Number);
        if (day && month && year) {
          dateObject = new Date(year, month - 1, day);
        }
      }
      
      const result = await photoService.apiPhotoUploadPhotoPost({
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        takeAt: dateObject.toISOString(),
        file: selectedFile
      });

      if (result.isSuccess) {
        alert('Foto enviada para aprovação com sucesso!');
        resetForm();
        onClose();
      } else {
        alert(`Erro: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      alert('Erro ao adicionar foto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', subtitle: '', description: '', date: '' });
    setSelectedFile(null);
  };

  const handleClose = () => {
    resetForm();
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
          Adicionar Nova Foto
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            label="Título da Foto"
            fullWidth
            value={form.title}
            onChange={handleInputChange('title')}
            placeholder="Ex: Show no Rock in Rio"
            disabled={loading}
          />
          
          <TextField
            label="Subtítulo da Foto"
            fullWidth
            value={form.subtitle}
            onChange={handleInputChange('subtitle')}
            placeholder="Subtítulo opcional"
            disabled={loading}
          />
          
          <TextField
            label="Descrição"
            fullWidth
            multiline
            rows={4}
            value={form.description}
            onChange={handleInputChange('description')}
            placeholder="Descreva sua foto..."
            disabled={loading}
          />
          
          <TextField
            label="Data da Foto (dd/MM/yyyy)"
            value={form.date}
            onChange={handleDateChange}
            placeholder="01/01/2024"
            disabled={loading}
            sx={{ maxWidth: 200 }}
          />
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Selecionar Imagem
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="photo-upload"
              disabled={loading}
            />
            <label htmlFor="photo-upload">
              <Button
                variant="outlined"
                component="span"
                disabled={loading}
                sx={{ mb: 1 }}
              >
                {selectedFile ? 'Trocar Imagem' : 'Selecionar Imagem'}
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" color="text.secondary">
                {selectedFile.name}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !form.title.trim() || !selectedFile}
          sx={{
            background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
            '&:hover': {
              background: 'linear-gradient(45deg, #b71c1c, #f44336)'
            }
          }}
        >
          {loading ? 'Enviando...' : 'Adicionar Foto'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPhotoModal;
