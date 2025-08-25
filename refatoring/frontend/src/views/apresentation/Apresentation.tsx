import { Box, Button, Typography, useTheme, useMediaQuery } from '@mui/material'
import CelticFrost from '../../assets/Celtif_Frost.jpg'
import { UserApi } from '../../gen/api/src';
import ApiConfiguration from '../../apiConfig';
import { useNavigate } from 'react-router-dom';

const Apresentation = () => {
    const userService = new UserApi(ApiConfiguration);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const skipApresentation = async () => {
        const result = await userService.apiUserSkipIntroductionGet();
        navigate('/videos');
    }

    return (
        <>
            <Box
                component="img"
                position="fixed"
                width="100%"
                height="100%"
                sx={{
                    opacity: "1",
                    objectFit: "cover",
                    zIndex: -1
                }}
                src={CelticFrost}
                alt="Celtic Frost"
            />
            <Box
                position="absolute"
                top={{
                    xs: "50%",
                    md: "60%"
                }}
                left="50%"
                color="white"
                textAlign="center"
                sx={{
                    transform: "translate(-50%, -50%)",
                    width: {
                        xs: "90%",
                        sm: "80%",
                        md: "70%",
                        lg: "60%"
                    },
                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4
                    }
                }}
            >
                <Typography
                    sx={{
                        fontSize: {
                            xs: "0.875rem",
                            sm: "1rem",
                            md: "1.125rem"
                        },
                        lineHeight: {
                            xs: 1.5,
                            sm: 1.6,
                            md: 1.7
                        },
                        mb: {
                            xs: 2,
                            sm: 3,
                            md: 4
                        }
                    }}
                >
                    Bem-vindo ao New Level, um espaço dedicado aos verdadeiros amantes do metal que viveram a intensidade dos anos 80 na região do ABC, mais especificamente em Santo André. Aqui, a paixão pela música pesada e as memórias de uma época única se encontram para celebrar a cultura headbanger.

                    Nossa história começa com as experiências marcantes de um jovem na cena metal daquela época. Meu pai, junto com seus companheiros headbangers, trilhava os caminhos do Celtic Frost, Slayer, Whiplash, Exodus e muitos outros ícones do metal. As histórias de brigas épicas e shows inesquecíveis eram compartilhadas, criando uma teia de conexões que se estendia além da música.

                    Hoje, mergulhado no mundo da programação, surgiu a ideia de criar este espaço para unir os headbangers das antigas. Este site, concebido sem grandes planejamentos, busca resgatar as raízes do metal e reacender as lembranças nostálgicas daquela época dourada. Mais do que um simples portal, é um convite para reviver as emoções, relembrar as vivências e conectar-se novamente com a cultura que moldou tantas histórias.

                    Explore nossas páginas e embarque em uma jornada pela essência do metal. Seja revivendo as lendárias batalhas de mosh pit, relembrando as letras que ecoavam pelas ruas do ABC, ou simplesmente compartilhando suas próprias histórias, New Level é o lugar onde a comunidade headbanger se encontra para celebrar o passado e construir novas conexões no presente.
                </Typography>
                <Box 
                    sx={{
                        p: {
                            xs: "1.5rem",
                            sm: "2rem",
                            md: "3rem"
                        }
                    }}
                >
                    <Button
                        onClick={skipApresentation}
                        sx={{
                            backgroundColor: "#3a100b",
                            color: "white",
                            width: {
                                xs: "100%",
                                sm: "auto"
                            },
                            minWidth: {
                                sm: "200px"
                            },
                            py: {
                                xs: 1.5,
                                sm: 1.75,
                                md: 2
                            },
                            px: {
                                xs: 3,
                                sm: 4,
                                md: 5
                            },
                            fontSize: {
                                xs: "0.875rem",
                                sm: "1rem",
                                md: "1.125rem"
                            },
                            '&:hover': {
                                backgroundColor: "#5a1a0f"
                            }
                        }}
                    >
                        Começar
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default Apresentation
