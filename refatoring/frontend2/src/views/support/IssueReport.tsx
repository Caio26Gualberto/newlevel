import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Checkbox, 
  Chip, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  OutlinedInput, 
  LinearProgress, 
  useTheme, 
  useMediaQuery,
  Paper,
  Fade,
  Alert,
  Divider
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import SendIcon from '@mui/icons-material/Send';
import ApiConfiguration from '../../config/apiConfig';
import { CommonApi, EGitLabels, SelectOptionDto } from '../../gen/api/src';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const IssueReport = () => {
  const commonApi = new CommonApi(ApiConfiguration);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState<boolean>(false);
  const [issueCreated, setIssueCreated] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [problemTypes, setProblemTypes] = useState<SelectOptionDto[]>([]);
  const [devices, setDevices] = useState<SelectOptionDto[]>([]);
  const [selectedProblemTypes, setSelectedProblemTypes] = useState<number[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    setFadeIn(true);
    loadLabels();
  }, []);

  const loadLabels = async () => {
    try {
      const result = (await commonApi.apiCommonGetDisplayGitLabelsGet()).data;
      if (result) {
        setProblemTypes(result.filter(x => x.value === 1 || x.value === 2));
        setDevices(result.filter(x => x.value === 3 || x.value === 4));
      }
    } catch (error) {
      console.error('Error loading labels:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProblemTypeChange = (event: any) => {
    setSelectedProblemTypes(event.target.value);
  };

  const handleDeviceChange = (event: any) => {
    setSelectedDevices(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      const allLabels = [...selectedDevices, ...selectedProblemTypes];
      
      const result = await commonApi.apiCommonCreateIssuePost({
        createGitIssueInput: {
          description: formData.description,
          title: formData.title,
          gitLabels: allLabels as EGitLabels[]
        }
      });

      if (result.isSuccess) {
        setIssueCreated(result.data!);
        setFormData({ title: '', description: '' });
        setSelectedDevices([]);
        setSelectedProblemTypes([]);
      } else {
        alert(`Erro: ${(result as any).message}`);
      }
    } catch (error) {
      console.error('Error creating issue:', error);
      alert('Erro ao criar o relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Progress bar effect
  useEffect(() => {
    if (issueCreated) {
      const timeoutDuration = 10000;
      const interval = timeoutDuration / 100;

      let currentProgress = 0;
      const timer = setInterval(() => {
        currentProgress += 1;
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          clearInterval(timer);
        }
      }, interval);

      const timeout = setTimeout(() => {
        setIssueCreated('');
        setProgress(0);
      }, timeoutDuration);

      return () => {
        clearTimeout(timeout);
        clearInterval(timer);
      };
    }
  }, [issueCreated]);

  return (
    <>
      <LoadingSpinner isLoading={loading} />
      <Container 
        maxWidth="md" 
        sx={{ 
          minHeight: '100vh',
          py: 4,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Fade in={fadeIn} timeout={800}>
          <Paper
            elevation={8}
            sx={{
              width: '100%',
              p: { xs: 3, sm: 4, md: 6 },
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                  mb: 2,
                  boxShadow: '0 8px 32px rgba(211, 47, 47, 0.3)'
                }}
              >
                <BugReportIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              
              <Typography 
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                Reportar Problema
              </Typography>
              
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
              >
                Encontrou um bug ou tem uma sugestão? Nos ajude a melhorar!
              </Typography>
              
              <Divider sx={{ mt: 3, mb: 4 }} />
            </Box>

            {/* Success Alert */}
            {issueCreated && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
              >
                <Typography variant="body1" sx={{ mb: 1 }}>
                  ✅ Relatório criado com sucesso!{' '}
                  <Button
                    component="a"
                    href={issueCreated}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{ textTransform: 'none' }}
                  >
                    Ver no GitHub
                  </Button>
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    borderRadius: 1,
                    height: 6,
                    bgcolor: 'rgba(76, 175, 80, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'success.main'
                    }
                  }}
                />
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Title Field */}
              <TextField
                label="Título do Problema *"
                variant="outlined"
                fullWidth
                margin="normal"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ex: Erro ao fazer login no mobile"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              {/* Description Field */}
              <TextField
                label="Descrição Detalhada *"
                variant="outlined"
                fullWidth
                margin="normal"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
                placeholder="Descreva o problema em detalhes: o que aconteceu, quando aconteceu, passos para reproduzir..."
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              {/* Problem Types */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Tipo de Problema/Sugestão</InputLabel>
                <Select
                  multiple
                  input={<OutlinedInput label="Tipo de Problema/Sugestão" />}
                  value={selectedProblemTypes}
                  onChange={handleProblemTypeChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={problemTypes.find(option => option.value === value)?.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    borderRadius: 2,
                    '& .MuiSelect-select': {
                      minHeight: 'auto'
                    }
                  }}
                >
                  {problemTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Checkbox 
                        checked={selectedProblemTypes.includes(option.value!)} 
                        size="small"
                      />
                      <Typography>{option.name}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Devices */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel>Dispositivos Afetados</InputLabel>
                <Select
                  multiple
                  input={<OutlinedInput label="Dispositivos Afetados" />}
                  value={selectedDevices}
                  onChange={handleDeviceChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={devices.find(option => option.value === value)?.name}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    borderRadius: 2,
                    '& .MuiSelect-select': {
                      minHeight: 'auto'
                    }
                  }}
                >
                  {devices.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Checkbox 
                        checked={selectedDevices.includes(option.value!)} 
                        size="small"
                      />
                      <Typography>{option.name}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                endIcon={<SendIcon />}
                disabled={loading || !formData.title.trim() || !formData.description.trim()}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #d32f2f, #ff6b6b)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #b71c1c, #f44336)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(211, 47, 47, 0.4)'
                  },
                  '&:disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                    transform: 'none'
                  }
                }}
              >
                Enviar Relatório
              </Button>
            </Box>

            {/* Footer Info */}
            <Box 
              sx={{ 
                mt: 4, 
                p: 2, 
                bgcolor: 'rgba(211, 47, 47, 0.05)',
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                💡 <strong>Dica:</strong> Quanto mais detalhes você fornecer, mais rápido conseguiremos resolver o problema!
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </>
  );
};

export default IssueReport;
