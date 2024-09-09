import { Box, Input, Button, Typography, Divider, Checkbox, FormControlLabel } from '@mui/material'
import NewLevelModal from '../../../components/NewLevelModal'
import NewLevelModalHeader from '../../../components/NewLevelModalHeader'
import React, { useState } from 'react'
import { useMobile } from '../../../MobileContext';
import NewLevelButton from '../../../components/NewLevelButton';
import { useNavigate } from 'react-router-dom';
import { IModalProps } from '../../../interfaces/newLevelInterfaces';

const ChoiceTypeUserModal: React.FC<IModalProps> = ({ open, onClose }) => {
    const { isMobile } = useMobile()
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
            width={isMobile ? '90%' : 500}
            height={'auto'}
        >
            <>
                <NewLevelModalHeader title="Banda ou Usuário?" closeModal={onClose} />
                <Divider variant='fullWidth' sx={{ backgroundColor: "black" }} />
                <Box
                    height={isMobile ? 'auto' : '60%'}
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    p={2}
                >
                    <Box>
                        <Typography variant='h6'>Escolha entre os tipos Banda/Artista ou Usuário</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
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
                            label="Banda/Artista"
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
                            label="Usuário"
                        />
                    </Box>
                    {selected === 'Banda/Artista' &&
                        <>
                            <Box display="flex" justifyContent="center" textAlign="center">
                                <Typography variant='body2'>
                                    Para o processo de criação de um usuário do tipo "banda", será implementado um sistema de verificação adicional. A banda precisará entrar em contato com o administrador da página para a confirmação de identidade. Esse processo garante a segurança dos usuários e das próprias bandas, evitando que pessoas não autorizadas criem contas em nome de uma banda, o que poderia levar a atividades fraudulentas ou prejudicar a reputação da banda.

                                    Esse mecanismo de verificação é crucial para evitar que qualquer pessoa alegue ser parte de uma banda e, assim, evite possíveis difamações ou problemas relacionados à integridade das contas.
                                </Typography>
                            </Box>
                            <Typography mt={2} textAlign="center" variant='caption'>Não se preocupe, o contato do administrador será passado no final da etapa</Typography>
                        </>
                    }
                    {selected &&
                        <Box mt={2}>
                            <NewLevelButton onClick={goNext} title='Continuar'></NewLevelButton>
                        </Box>
                    }
                </Box>
            </>
        </NewLevelModal>
    )
}

export default ChoiceTypeUserModal