import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  Paper,
  Container,
  Stack,
  InputAdornment,
  IconButton,
  Fade,
  Autocomplete,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  useTheme,
  useMediaQuery,
  Divider,
  Tooltip,
  Zoom
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  MusicNote,
  ArrowBack,
  Person,
  LocationCity,
  Description,
  CalendarToday,
  Add,
  Delete,
  Help,
  Group
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthenticateApi, CommonApi, EActivityLocation, EMusicGenres } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';
import Swal from 'sweetalert2';
import AddMembersModal, { BandMember } from '../../components/modals/AddMembersModal';

interface City {
  value: number;
  label: string;
}

interface MusicGenre {
  value: number;
  name: string;
}

const BandRegister = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City>({ label: '', value: -1 });
  const [musicGenres, setMusicGenres] = useState<MusicGenre[]>([]);
  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [members, setMembers] = useState<BandMember[]>([]);
  
  // Form data
  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    bandName: '',
    description: '',
    createdAt: '',
    musicGenres: [] as number[]
  });
  
  // API services
  const authService = useMemo(() => new AuthenticateApi(ApiConfiguration), []);
  const commonService = useMemo(() => new CommonApi(ApiConfiguration), []);

  // Fetch cities and music genres on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesResponse, genresResponse] = await Promise.all([
          commonService.apiCommonGetDisplayCitiesGet(),
          commonService.apiCommonGetDisplayMusicGenresGet()
        ]);
        
        if (citiesResponse.data && Array.isArray(citiesResponse.data)) {
          const cityOptions = citiesResponse.data.map((city: any) => ({
            value: city.id || city.value,
            label: city.name
          }));
          setCities(cityOptions);
        }
        
        if (genresResponse.data && Array.isArray(genresResponse.data)) {
          const genreOptions: MusicGenre[] = genresResponse.data
            .filter((genre) => genre.value !== undefined && genre.name !== undefined)
            .map((genre) => ({
              value: genre.value!,
              name: genre.name!
            }));
          setMusicGenres(genreOptions);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [commonService]);
  
  // Add background class effect
  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement && window.location.pathname === '/bandRegister') {
      rootElement.classList.add('image-with-opacity');
      return () => rootElement.classList.remove('image-with-opacity');
    }
  }, []);
  
  const handleUserFormChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm(prev => ({ ...prev, [field]: e.target.value }));
  };
  
  const handleCityChange = (event: any) => {
    const selectedCityValue = event.target.value as number;
    const selectedCityObj = cities.find(city => city.value === selectedCityValue);
    setSelectedCity(selectedCityObj || { label: '', value: -1 });
  };
  
  const handleGenreChange = (event: any) => {
    const selectedValues = event.target.value as number[];
    setUserForm(prevState => ({
      ...prevState,
      musicGenres: selectedValues
    }));
  };

  const handleOpenMemberModal = () => {
    setOpenMemberModal(true);
  };

  const handleCloseMemberModal = () => {
    setOpenMemberModal(false);
  };

  const handleSaveMembers = (newMembers: BandMember[]) => {
    setMembers(newMembers);
  };

  const transformMembersToObject = (members: BandMember[]): { [key: string]: string } => {
    return members.reduce((acc, member) => {
      acc[member.name] = member.instrument;
      return acc;
    }, {} as { [key: string]: string });
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 8) {
      value = value.substr(0, 8);
    }
    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (value.length > 5) {
      value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }
    setUserForm({ ...userForm, createdAt: value });
  };
  
  const nextStep = () => {
    if (userForm.email === '' || userForm.password === '' || userForm.confirmPassword === '' || selectedCity.value === -1) {
      Swal.fire({
        title: 'Atenção!',
        text: 'Preencha todos os campos',
        icon: 'warning',
        confirmButtonColor: '#d32f2f'
      });
      return;
    }
    if (userForm.password.length < 6) {
      Swal.fire({
        title: 'Atenção!',
        text: 'A senha deve ter no mínimo 6 caracteres',
        icon: 'warning',
        confirmButtonColor: '#d32f2f'
      });
      return;
    }
    if (userForm.password !== userForm.confirmPassword) {
      Swal.fire({
        title: 'Atenção!',
        text: 'As duas senhas estão diferentes',
        icon: 'warning',
        confirmButtonColor: '#d32f2f'
      });
      return;
    }
    if (!userForm.email.includes('@')) {
      Swal.fire({
        title: 'Atenção!',
        text: 'Email inválido',
        icon: 'warning',
        confirmButtonColor: '#d32f2f'
      });
      return;
    }
    setStep(2);
  };
  
  const backStep = () => {
    setStep(1);
  };
  
  const registerBand = async () => {
    try {
      setLoading(true);
      const [day, month, year] = userForm.createdAt.split('/').map(Number);
      const dateObject = new Date(year, month - 1, day);
      const newIntegrants = transformMembersToObject(members);
      
      const result = await authService.apiAuthenticateBandRegisterPost({
        registerInputDto: {
          activityLocation: selectedCity.value as EActivityLocation,
          createdAt: dateObject,
          description: userForm.description,
          email: userForm.email,
          nickname: userForm.bandName,
          password: userForm.password,
          integrants: newIntegrants,
          musicGenres: userForm.musicGenres as EMusicGenres[],
        }
      });
      
      if (result.isSuccess) {
        Swal.fire({
          title: 'Sucesso!',
          text: result.message || 'Banda registrada com sucesso!',
          icon: 'success',
          confirmButtonColor: '#d32f2f'
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Swal.fire({
        title: 'Erro!',
        text: 'Erro ao registrar banda. Tente novamente.',
        icon: 'error',
        confirmButtonColor: '#d32f2f'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Add Members Modal - placeholder for now */}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          minHeight: "100vh",
          p: { xs: 1, sm: 2 }
        }}
      >
        {step === 1 ? (
          <Paper
            elevation={10}
            sx={{
              padding: { xs: 1, sm: 2 },
              display: "flex",
              flexDirection: "column",
              width: { xs: '95%', sm: '80%', md: '60%', lg: '50%' },
              maxWidth: "800px"
            }}
          >
            <Box sx={{ mb: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Typography 
                variant={isSmallMobile ? "h6" : "h5"} 
                fontWeight="bold" 
                component="h5"
                sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
              >
                Informações
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Typography 
                  variant={isSmallMobile ? "h6" : "h6"}
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  Primeiro crie um usuário
                  <Tooltip 
                    TransitionComponent={Zoom} 
                    title="Seu email será usado como forma de login"
                  >
                    <Box ml={1} component="span" sx={{ cursor: "pointer", verticalAlign: "-5px" }}>
                      <Help color='action' />
                    </Box>
                  </Tooltip>
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
                <Box>
                  <Tooltip 
                    TransitionComponent={Zoom} 
                    title={
                      <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        Seu email será usado como forma de login
                      </Typography>
                    }
                  >
                    <InputLabel variant="standard">
                      <Typography fontWeight="bold">Email:</Typography>
                    </InputLabel>
                  </Tooltip>
                  <TextField 
                    fullWidth 
                    type="email" 
                    placeholder="Email" 
                    value={userForm.email}
                    onChange={handleUserFormChange('email')}
                    sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
                  />
                </Box>
                
                <Box>
                  <InputLabel variant="standard">
                    <Typography fontWeight="bold">Senha:</Typography>
                  </InputLabel>
                  <TextField 
                    fullWidth 
                    type="password" 
                    placeholder="Senha" 
                    value={userForm.password}
                    onChange={handleUserFormChange('password')}
                    sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
                  />
                </Box>
                
                <Box>
                  <InputLabel variant="standard">
                    <Typography fontWeight="bold">Confirme a senha:</Typography>
                  </InputLabel>
                  <TextField 
                    fullWidth 
                    type="password" 
                    placeholder="Confirme a senha" 
                    value={userForm.confirmPassword}
                    onChange={handleUserFormChange('confirmPassword')}
                    sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
                  />
                </Box>
                
                <Box>
                  <Tooltip 
                    TransitionComponent={Zoom} 
                    title={
                      <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        Cidade da banda, onde foi fundada, ou maior atuação
                      </Typography>
                    }
                  >
                    <InputLabel>
                      <Typography fontWeight="bold">Cidade:</Typography>
                    </InputLabel>
                  </Tooltip>
                  <FormControl fullWidth>
                    <Select
                      value={selectedCity.value}
                      onChange={handleCityChange}
                      sx={{ '& .MuiSelect-select': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city.value} value={city.value}>
                          {city.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", flexDirection: { xs: "column", sm: "row" }, gap: 1 }}>
                  <Button 
                    variant='outlined' 
                    onClick={() => navigate('/')} 
                    sx={{ width: { xs: '100%', sm: '30%' }, fontSize: { xs: "0.875rem", sm: "1rem" } }}
                  >
                    Voltar
                  </Button>
                  <Button 
                    variant='contained' 
                    onClick={nextStep} 
                    sx={{ width: { xs: '100%', sm: '30%' }, fontSize: { xs: "0.875rem", sm: "1rem" } }}
                  >
                    Próximo
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        ) : (
          <Paper
            elevation={10}
            sx={{
              padding: { xs: 1, sm: 2 },
              display: "flex",
              flexDirection: "column",
              width: { xs: '95%', sm: '80%', md: '60%', lg: '50%' },
              maxWidth: "800px"
            }}
          >
            <Box sx={{ mb: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Typography 
                variant={isSmallMobile ? "h6" : "h5"} 
                fontWeight="bold" 
                component="h5"
                sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
              >
                Informações
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", width: "100%" }}>
                <Typography 
                  variant={isSmallMobile ? "h6" : "h6"}
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  Registre sua banda
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
                <TextField
                  name="bandName"
                  label="Nome da Banda"
                  value={userForm.bandName}
                  onChange={handleUserFormChange('bandName')}
                  fullWidth
                  margin="normal"
                  sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
                />

                <TextField
                  name="description"
                  label="Descrição/Bio"
                  value={userForm.description}
                  onChange={handleUserFormChange('description')}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={isSmallMobile ? 5 : 10}
                  sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
                />

                <FormControl fullWidth sx={{ marginTop: 2, '& .MuiInputLabel-root': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}>
                  <InputLabel>Estilo musical</InputLabel>
                  <Select
                    multiple
                    input={<OutlinedInput label="Estilo musical" />}
                    value={userForm.musicGenres}
                    onChange={handleGenreChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip 
                            key={value} 
                            label={musicGenres.find(option => option.value === value)?.name}
                            size={isSmallMobile ? "small" : "medium"}
                          />
                        ))}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                          overflowY: 'auto'
                        }
                      }
                    }}
                    sx={{ '& .MuiSelect-select': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
                  >
                    {musicGenres.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Checkbox checked={userForm.musicGenres.includes(option.value)} />
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          {option.name}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", mb: 1 }}>
                  <TextField
                    margin="dense"
                    label="Data do Inicio da Banda (Aproximadamente)"
                    type="text"
                    sx={{ 
                      width: { xs: '100%', sm: '40%' },
                      '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } }
                    }}
                    value={userForm.createdAt}
                    onChange={handleDateChange}
                  />
                </Box>
                
                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", flexDirection: { xs: "column", sm: "row" }, gap: 1 }}>
                  <Button 
                    variant='outlined' 
                    onClick={backStep} 
                    sx={{ width: { xs: '100%', sm: '30%' }, fontSize: { xs: "0.875rem", sm: "1rem" } }}
                  >
                    Voltar
                  </Button>
                  <Button 
                    variant='contained' 
                    onClick={handleOpenMemberModal} 
                    color='success' 
                    startIcon={<Group />}
                    sx={{ width: { xs: '100%', sm: '30%' }, fontSize: { xs: "0.875rem", sm: "1rem" } }}
                  >
                    Adicionar Membros ({members.length})
                  </Button>
                  <Button 
                    variant='contained' 
                    onClick={registerBand} 
                    color='primary' 
                    disabled={loading}
                    sx={{ width: { xs: '100%', sm: '30%' }, fontSize: { xs: "0.875rem", sm: "1rem" } }}
                  >
                    {loading ? 'Registrando...' : 'Registrar'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Modal para adicionar membros */}
      <AddMembersModal
        open={openMemberModal}
        onClose={handleCloseMemberModal}
        onSaveMembers={handleSaveMembers}
        initialMembers={members}
      />
    </>
  );
};

export default BandRegister;
