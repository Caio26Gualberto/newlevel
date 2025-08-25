import { Box, Button, Checkbox, Chip, Divider, FormControl, Icon, InputLabel, MenuItem, OutlinedInput, Paper, Popover, Select, SelectChangeEvent, TextField, Tooltip, Typography, Zoom, useTheme, useMediaQuery } from '@mui/material';
import ApiConfiguration from '../../apiConfig';
import { AuthenticateApi, CommonApi, EActivityLocation, EMusicGenres, SelectOptionDto } from '../../gen/api/src';
import React, { useState } from 'react'
import { IBandRegister, IMember } from '../../interfaces/newLevelInterfaces';
import NewLevelButton from '../../components/NewLevelButton';
import NewLevelLoading from '../../components/NewLevelLoading';
import HelpIcon from '@mui/icons-material/Help';
import * as toastr from 'toastr';
import AddMembersModal from './addMembersModal/AddMembersModal';
import { useNavigate } from 'react-router-dom';

const BandRegister = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const navigate = useNavigate()
  const commonService = new CommonApi(ApiConfiguration)
  const authenticateService = new AuthenticateApi(ApiConfiguration)
  const [musicGenres, setMusicGenres] = useState<SelectOptionDto[]>([])
  const [members, setMembers] = useState<IMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [step, setStep] = useState<number>(1)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cities, setCities] = useState<SelectOptionDto[]>([])
  const [selectedCity, setSelectedCity] = useState<SelectOptionDto>({ name: '', value: -1 })
  const [userForm, setUserForm] = useState<IBandRegister>({
    bandName: "",
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    createdAt: "",
    description: "",
    city: selectedCity,
    musicGenres: []
  })

  const handleGenreChange = (event: SelectChangeEvent<number[]>) => {
    const selectedValues = event.target.value as number[];
    setUserForm(prevState => ({
      ...prevState,
      musicGenres: selectedValues
    }));
  };

  const backStep = () => {
    setStep(1)
  }

  const nextStep = () => {
    if (userForm.email === '' || userForm.password === '' || userForm.confirmPassword === '' || selectedCity.value === -1) {
      toastr.warning('Preencha todos os campos', 'Atenção!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
      return
    }
    if (userForm.password.length < 6) {
      toastr.warning('A senha deve ter no minímo 6 caracteres', 'Atenção!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
      return
    }
    if (userForm.password !== userForm.confirmPassword) {
      toastr.warning('As duas senhas estão diferentes', 'Atenção!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
      return
    }
    if (!userForm.email.includes('@')) {
      toastr.warning('Email inválido', 'Atenção!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
      return
    }

    setStep(2)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSaveMembers = (newMembers: IMember[]) => {
    setMembers(newMembers);
  };

  const handleCityChange = (event: any) => {
    const selectedCityValue = event.target.value as number;
    const selectedCity = cities.find(city => city.value === selectedCityValue);
    setSelectedCity(selectedCity!);
  }

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove caracteres não numéricos
    value = value.replace(/\D/g, '');

    // Limita o comprimento máximo do valor
    if (value.length > 8) {
      value = value.substr(0, 8);
    }

    // Insere a máscara dd/MM/yyyy
    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (value.length > 5) {
      value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }

    // Atualiza o estado
    setUserForm({ ...userForm, createdAt: value });
  };

  const transformMembersToObject = (members: IMember[]): { [key: string]: string } => {
    return members.reduce((acc, member) => {
      const keys = Object.keys(member.data);
      const values = Object.values(member.data);

      if (keys.length > 0 && values.length > 0) {
        keys.forEach((key, index) => {
          acc[key] = values[index];
        });
      }

      return acc;
    }, {} as { [key: string]: string });
  };


  async function registerBand() {
    try {
      setLoading(true)
      const [day, month, year] = userForm.createdAt.split('/').map(Number);
      const dateObject = new Date(year, month - 1, day)
      const newIntegrants = transformMembersToObject(members);
      const result = await authenticateService.apiAuthenticateBandRegisterPost({
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
      })
      if (result.isSuccess) {
        toastr.success(result.message!, 'Sucesso!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
        navigate('/')
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    (async () => {
      try {
        const result = await commonService.apiCommonGetDisplayMusicGenresGet();
        const result2 = await commonService.apiCommonGetDisplayCitiesGet()
        result.data!.push({ name: 'Selecione uma cidade', value: -1 })
        setCities(result2.data!)

        if (result.isSuccess) {
          setMusicGenres(result.data!);
        }
      } catch (error) {
        console.error("Failed to fetch music genres:", error);
      }
    })();
  }, []);

  React.useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      if (window.location.pathname === '/bandRegister') {
        rootElement.classList.add('image-with-opacity-bandRegister');
      }
      return () => {
        rootElement.classList.remove('image-with-opacity-bandRegister');
      };
    }
  }, [])

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <AddMembersModal onClose={handleCloseModal} open={isOpenModal} onSaveMembers={handleSaveMembers} />
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          minHeight: "100vh",
          p: {
            xs: 1,
            sm: 2
          }
        }}
      >
        {step === 1 ?
          (
            <>
              <Paper
                elevation={10}
                sx={{
                  padding: {
                    xs: 1,
                    sm: 2
                  },
                  display: "flex",
                  flexDirection: "column",
                  width: {
                    xs: '95%',
                    sm: '80%',
                    md: '60%',
                    lg: '50%'
                  },
                  maxWidth: "800px"
                }}
              >
                <NewLevelLoading isLoading={loading} />
                <Box 
                  sx={{
                    mb: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Typography 
                    variant={isSmallMobile ? "h6" : "h5"} 
                    fontWeight="bold" 
                    component="h5"
                    sx={{
                      fontSize: {
                        xs: "1.25rem",
                        sm: "1.5rem"
                      }
                    }}
                  >
                    Informações
                  </Typography>
                </Box>

                <Divider />

                <Box 
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginTop: 2
                  }}
                >
                  <Box 
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%"
                    }}
                  >
                    <Typography 
                      variant={isSmallMobile ? "h6" : "h6"}
                      sx={{
                        fontSize: {
                          xs: "1rem",
                          sm: "1.25rem"
                        }
                      }}
                    >
                      Primeiro crie um usuário
                      <Box 
                        ml={1} 
                        onClick={handleClick} 
                        component="span" 
                        sx={{ 
                          cursor: "pointer", 
                          verticalAlign: "-5px" 
                        }}
                      >
                        <HelpIcon color='action' />
                      </Box>
                    </Typography>
                  </Box>

                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <Box 
                      sx={{
                        p: 2,
                        maxWidth: {
                          xs: 250,
                          sm: 300
                        },
                        wordWrap: 'break-word'
                      }}
                    >
                      <Typography 
                        variant="body2"
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.875rem"
                          }
                        }}
                      >
                        Para criar sua banda, é necessário primeiro criar um usuário padrão. Isso acontece porque uma "banda" é um tipo especial de usuário no sistema, com algumas funcionalidades a mais voltadas para artistas e grupos. No entanto, como qualquer outro usuário, a banda ainda precisa de informações básicas de conta, como nome de usuário e senha, que todos os usuários possuem.

                        Não se preocupe, esse cadastro de usuário não interfere com seu perfil pessoal. É apenas uma etapa para garantir que a banda tenha acesso às mesmas funcionalidades básicas que qualquer outro usuário, com a adição de recursos específicos para artistas.
                      </Typography>
                    </Box>
                  </Popover>

                  <Box 
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      gap: 2
                    }}
                  >
                    <Box>
                      <Tooltip 
                        TransitionComponent={Zoom} 
                        title={
                          <Typography
                            sx={{
                              fontSize: {
                                xs: "0.75rem",
                                sm: "0.875rem"
                              }
                            }}
                          >
                            Seu email será usado como forma de login, posteriormente será utilizado para entrar no site
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
                        onChange={(event) => setUserForm({ ...userForm, email: event.target.value })}
                        sx={{
                          '& .MuiInputBase-input': {
                            fontSize: {
                              xs: '0.875rem',
                              sm: '1rem'
                            }
                          }
                        }}
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
                        onChange={(event) => setUserForm({ ...userForm, password: event.target.value })}
                        sx={{
                          '& .MuiInputBase-input': {
                            fontSize: {
                              xs: '0.875rem',
                              sm: '1rem'
                            }
                          }
                        }}
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
                        onChange={(event) => setUserForm({ ...userForm, confirmPassword: event.target.value })}
                        sx={{
                          '& .MuiInputBase-input': {
                            fontSize: {
                              xs: '0.875rem',
                              sm: '1rem'
                            }
                          }
                        }}
                      />
                    </Box>
                    <Box>
                      <Tooltip 
                        TransitionComponent={Zoom} 
                        title={
                          <Typography
                            sx={{
                              fontSize: {
                                xs: "0.75rem",
                                sm: "0.875rem"
                              }
                            }}
                          >
                            Cidade da banda, onde foi fundada, ou maior atuação
                          </Typography>
                        }
                      >
                        <InputLabel id="demo-simple-select-label">
                          <Typography fontWeight="bold">Cidade:</Typography>
                        </InputLabel>
                      </Tooltip>
                      <FormControl fullWidth>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectedCity.value}
                          onChange={handleCityChange}
                          sx={{
                            '& .MuiSelect-select': {
                              fontSize: {
                                xs: '0.875rem',
                                sm: '1rem'
                              }
                            }
                          }}
                        >
                          {cities.map((city) => (
                            <MenuItem key={city.value} value={city.value}>
                              {city.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box 
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: {
                          xs: "column",
                          sm: "row"
                        },
                        gap: 1
                      }}
                    >
                      <NewLevelButton onClick={() => navigate('/')} title='Voltar' width='30%' />
                      <NewLevelButton onClick={nextStep} title='Próximo' width='30%' />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </>
          ) : (
            <>
              <Paper
                elevation={10}
                sx={{
                  padding: {
                    xs: 1,
                    sm: 2
                  },
                  display: "flex",
                  flexDirection: "column",
                  width: {
                    xs: '95%',
                    sm: '80%',
                    md: '60%',
                    lg: '50%'
                  },
                  maxWidth: "800px"
                }}
              >
                <NewLevelLoading isLoading={loading} />
                <Box 
                  sx={{
                    mb: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Typography 
                    variant={isSmallMobile ? "h6" : "h5"} 
                    fontWeight="bold" 
                    component="h5"
                    sx={{
                      fontSize: {
                        xs: "1.25rem",
                        sm: "1.5rem"
                      }
                    }}
                  >
                    Informações
                  </Typography>
                </Box>

                <Divider />

                <Box 
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginTop: 2
                  }}
                >
                  <Box 
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      width: "100%"
                    }}
                  >
                    <Typography 
                      variant={isSmallMobile ? "h6" : "h6"}
                      sx={{
                        fontSize: {
                          xs: "1rem",
                          sm: "1.25rem"
                        }
                      }}
                    >
                      Registre sua banda
                    </Typography>
                  </Box>

                  <Box 
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      gap: 2
                    }}
                  >
                    <TextField
                      name="bandName"
                      label="Nome da Banda"
                      value={userForm.bandName}
                      onChange={(e) => setUserForm(prevState => ({ ...prevState, bandName: e.target.value }))}
                      fullWidth
                      margin="normal"
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: {
                            xs: '0.875rem',
                            sm: '1rem'
                          }
                        }
                      }}
                    />

                    <TextField
                      name="description"
                      label="Descrição/Bio"
                      value={userForm.description}
                      onChange={(e) => setUserForm(prevState => ({ ...prevState, description: e.target.value }))}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={isSmallMobile ? 5 : 10}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: {
                            xs: '0.875rem',
                            sm: '1rem'
                          }
                        }
                      }}
                    />

                    <FormControl 
                      fullWidth 
                      sx={{ 
                        marginTop: 2,
                        '& .MuiInputLabel-root': {
                          fontSize: {
                            xs: '0.875rem',
                            sm: '1rem'
                          }
                        }
                      }}
                    >
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
                        sx={{
                          '& .MuiSelect-select': {
                            fontSize: {
                              xs: '0.875rem',
                              sm: '1rem'
                            }
                          }
                        }}
                      >
                        {musicGenres.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Checkbox checked={userForm.musicGenres.includes(option.value!)} />
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: '0.875rem',
                                  sm: '1rem'
                                }
                              }}
                            >
                              {option.name}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Box 
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        mb: 1
                      }}
                    >
                      <TextField
                        margin="dense"
                        id="date"
                        label="Data do Inicio da Banda (Aproximadamente)"
                        type="text"
                        sx={{ 
                          width: {
                            xs: '100%',
                            sm: '40%'
                          },
                          '& .MuiInputBase-input': {
                            fontSize: {
                              xs: '0.875rem',
                              sm: '1rem'
                            }
                          }
                        }}
                        value={userForm.createdAt}
                        onChange={handleDateChange}
                      />
                    </Box>
                    <Box 
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: {
                          xs: "column",
                          sm: "row"
                        },
                        gap: 1
                      }}
                    >
                      <Button 
                        variant='outlined' 
                        onClick={backStep} 
                        sx={{ 
                          width: {
                            xs: '100%',
                            sm: '30%'
                          },
                          fontSize: {
                            xs: "0.875rem",
                            sm: "1rem"
                          }
                        }}
                      >
                        Voltar
                      </Button>
                      <Button 
                        variant='contained' 
                        onClick={handleOpenModal} 
                        color='success' 
                        sx={{ 
                          width: {
                            xs: '100%',
                            sm: '30%'
                          },
                          fontSize: {
                            xs: "0.875rem",
                            sm: "1rem"
                          }
                        }}
                      >
                        Adicionar Membros
                      </Button>
                      <Button 
                        variant='contained' 
                        onClick={registerBand} 
                        color='primary' 
                        sx={{ 
                          width: {
                            xs: '100%',
                            sm: '30%'
                          },
                          fontSize: {
                            xs: "0.875rem",
                            sm: "1rem"
                          }
                        }}
                      >
                        Registrar
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </>
          )}


      </Box>
    </>
  );
}

export default BandRegister