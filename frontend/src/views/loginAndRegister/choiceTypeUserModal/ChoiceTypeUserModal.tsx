import { Box, Input, Button, Typography, Divider, Checkbox, FormControlLabel, useTheme, useMediaQuery } from '@mui/material'
import NewLevelModal from '../../../components/NewLevelModal'
import NewLevelModalHeader from '../../../components/NewLevelModalHeader'
import React, { useState } from 'react'
import NewLevelButton from '../../../components/NewLevelButton';
import { useNavigate } from 'react-router-dom';
import { IModalProps } from '../../../interfaces/newLevelInterfaces';

const ChoiceTypeUserModal: React.FC<IModalProps> = ({ open, onClose }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const navigate = useNavigate()

    const [selected, setSelected] = useState<string>('');

    const handleChange = (checkboxName: string) => {
        setSelected(checkboxName);
    };

    async function goNext() {
        if (selected === 'Banda/Artista') {
            navigate('/bandRegister')
        } else {
            navigate('/register')
        }
    }

    React.useEffect(() => {
        setSelected('')
    }, [open])

    return (
        <NewLevelModal
            open={open}
            onClose={onClose}
            width={isSmallMobile ? '95%' : isMobile ? '90%' : 500}
            height={'auto'}
        >
            <>
                <NewLevelModalHeader title="Banda ou Usuário?" closeModal={onClose} />
                <Divider variant='fullWidth' sx={{ backgroundColor: "black" }} />
                <Box
                    sx={{
                        height: {
                            xs: 'auto',
                            sm: '60%'
                        },
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        p: {
                            xs: 1,
                            sm: 2
                        }
                    }}
                >
                    <Box>
                        <Typography 
                            variant='h6'
                            sx={{
                                fontSize: {
                                    xs: "1rem",
                                    sm: "1.25rem"
                                },
                                textAlign: "center"
                            }}
                        >
                            Escolha entre os tipos Banda/Artista ou Usuário
                        </Typography>
                    </Box>
                    <Box 
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: {
                                xs: "column",
                                sm: "row"
                            },
                            gap: 1,
                            mt: 2
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selected === 'Banda/Artista'}
                                    onChange={() => handleChange('Banda/Artista')}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#f00', // Cor quando o checkbox está marcado
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: "0.875rem",
                                            sm: "1rem"
                                        }
                                    }}
                                >
                                    Banda/Artista
                                </Typography>
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selected === 'Usuário'}
                                    onChange={() => handleChange('Usuário')}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#f00', // Cor quando o checkbox está marcado
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: "0.875rem",
                                            sm: "1rem"
                                        }
                                    }}
                                >
                                    Usuário
                                </Typography>
                            }
                        />
                    </Box>
                    {selected === 'Banda/Artista' &&
                        <>
                            <Box 
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    mt: 2
                                }}
                            >
                                <Typography 
                                    variant='body2'
                                    sx={{
                                        fontSize: {
                                            xs: "0.75rem",
                                            sm: "0.875rem"
                                        },
                                        lineHeight: 1.5
                                    }}
                                >
                                    Para o processo de criação de um usuário do tipo "banda", será implementado um sistema de verificação adicional. A banda precisará entrar em contato com o administrador da página para a confirmação de identidade. Esse processo garante a segurança dos usuários e das próprias bandas, evitando que pessoas não autorizadas criem contas em nome de uma banda, o que poderia levar a atividades fraudulentas ou prejudicar a reputação da banda.

                                    Esse mecanismo de verificação é crucial para evitar que qualquer pessoa alegue ser parte de uma banda e, assim, evite possíveis difamações ou problemas relacionados à integridade das contas.
                                </Typography>
                            </Box>
                            <Typography 
                                sx={{
                                    mt: 2,
                                    textAlign: "center",
                                    fontSize: {
                                        xs: "0.625rem",
                                        sm: "0.75rem"
                                    }
                                }}
                                variant='caption'
                            >
                                Não se preocupe, o contato do administrador será passado no final da etapa
                            </Typography>
                        </>
                    }
                    {selected &&
                        <Box 
                            sx={{
                                mt: 2,
                                width: "100%"
                            }}
                        >
                            <NewLevelButton onClick={goNext} title='Continuar'></NewLevelButton>
                        </Box>
                    }
                </Box>
            </>
        </NewLevelModal>
    )
}

export default ChoiceTypeUserModal