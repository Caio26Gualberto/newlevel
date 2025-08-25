import React, { useMemo } from 'react';
import { Box, Button, Typography, useTheme, useMediaQuery, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserApi } from '../gen/api/src';
import ApiConfiguration from '../config/apiConfig';
import CelticFrost from '../assets/Celtif_Frost.jpg';

const Presentation = () => {
    const userService = useMemo(() => new UserApi(ApiConfiguration), []);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const skipPresentation = async () => {
        try {
            await userService.apiUserSkipIntroductionGet();
            navigate('/videos');
        } catch (error) {
            console.error('Error skipping introduction:', error);
            // Navigate anyway if there's an error
            navigate('/videos');
        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '100vh',
                width: '100%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {/* Background Image */}
            <Box
                component="img"
                src={CelticFrost}
                alt="Celtic Frost"
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: -2,
                    filter: 'brightness(0.7) contrast(1.1)'
                }}
            />

            {/* Dark Overlay */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    zIndex: -1
                }}
            />

            {/* Content */}
            <Fade in timeout={1000}>
                <Box
                    sx={{
                        position: 'relative',
                        width: {
                            xs: '95%',
                            sm: '85%',
                            md: '75%',
                            lg: '65%',
                            xl: '55%'
                        },
                        maxWidth: '800px',
                        color: 'white',
                        textAlign: 'center',
                        p: {
                            xs: 2,
                            sm: 3,
                            md: 4
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    {/* Title */}
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        gutterBottom
                        className="gradient-text"
                        sx={{
                            fontSize: {
                                xs: '1.75rem',
                                sm: '2.25rem',
                                md: '2.75rem',
                                lg: '3rem'
                            },
                            background: 'linear-gradient(45deg, #ff6b6b 30%, #d32f2f 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            mb: {
                                xs: 2,
                                sm: 3,
                                md: 4
                            }
                        }}
                    >
                        Bem-vindo ao New Level
                    </Typography>

                    {/* Main Text */}
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: {
                                xs: '0.9rem',
                                sm: '1rem',
                                md: '1.1rem',
                                lg: '1.125rem'
                            },
                            lineHeight: {
                                xs: 1.6,
                                sm: 1.7,
                                md: 1.8
                            },
                            mb: {
                                xs: 3,
                                sm: 4,
                                md: 5
                            },
                            textAlign: 'justify',
                            color: 'rgba(255, 255, 255, 0.95)',
                            fontWeight: 400,
                            '& p': {
                                mb: 2
                            }
                        }}
                    >
                        <Box component="p" sx={{ mb: 2 }}>
                            Um espaço dedicado aos verdadeiros amantes do metal que viveram a intensidade dos anos 80 na região do ABC, mais especificamente em Santo André. Aqui, a paixão pela música pesada e as memórias de uma época única se encontram para celebrar a cultura headbanger.
                        </Box>
                        
                        <Box component="p" sx={{ mb: 2 }}>
                            Nossa história começa com as experiências marcantes de um jovem na cena metal daquela época. Meu pai, junto com seus companheiros headbangers, trilhava os caminhos do Celtic Frost, Slayer, Whiplash, Exodus e muitos outros ícones do metal. As histórias de brigas épicas e shows inesquecíveis eram compartilhadas, criando uma teia de conexões que se estendia além da música.
                        </Box>
                        
                        <Box component="p" sx={{ mb: 2 }}>
                            Hoje, mergulhado no mundo da programação, surgiu a ideia de criar este espaço para unir os headbangers das antigas. Este site, concebido sem grandes planejamentos, busca resgatar as raízes do metal e reacender as lembranças nostálgicas daquela época dourada. Mais do que um simples portal, é um convite para reviver as emoções, relembrar as vivências e conectar-se novamente com a cultura que moldou tantas histórias.
                        </Box>
                        
                        <Box component="p">
                            Explore nossas páginas e embarque em uma jornada pela essência do metal. Seja revivendo as lendárias batalhas de mosh pit, relembrando as letras que ecoavam pelas ruas do ABC, ou simplesmente compartilhando suas próprias histórias, New Level é o lugar onde a comunidade headbanger se encontra para celebrar o passado e construir novas conexões no presente.
                        </Box>
                    </Typography>

                    {/* Start Button */}
                    <Button
                        onClick={skipPresentation}
                        variant="contained"
                        size="large"
                        sx={{
                            py: {
                                xs: 1.5,
                                sm: 2,
                                md: 2.5
                            },
                            px: {
                                xs: 4,
                                sm: 5,
                                md: 6
                            },
                            fontSize: {
                                xs: '1rem',
                                sm: '1.125rem',
                                md: '1.25rem'
                            },
                            fontWeight: 600,
                            background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
                            boxShadow: '0 8px 25px rgba(211, 47, 47, 0.4)',
                            borderRadius: 2,
                            textTransform: 'none',
                            minWidth: {
                                xs: '200px',
                                sm: '250px'
                            },
                            '&:hover': {
                                background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
                                boxShadow: '0 12px 30px rgba(211, 47, 47, 0.6)',
                                transform: 'translateY(-3px)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Começar Jornada
                    </Button>
                </Box>
            </Fade>
        </Box>
    );
};

export default Presentation;
