import { Box, Button, Typography } from '@mui/material'
import CelticFrost from '../../assets/Celtif_Frost.jpg'
import { UserApi } from '../../gen/api/src';
import ApiConfiguration from '../../apiConfig';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '../../MobileContext';

const Apresentation = () => {
    const userService = new UserApi(ApiConfiguration);
    const navigate = useNavigate();
    const { isMobile } = useMobile()
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
                    ...(isMobile && { objectFit: "cover" }), // Ajusta a imagem somente para mobile
                }}
                src={CelticFrost}
                alt="Celtic Frost"
            />
            <Box
                position="absolute"
                top="60%" // Mantém o valor original para desktop
                left="50%"
                color="white"
                textAlign="center"
                sx={{
                    transform: "translate(-50%, -50%)",
                    ...(isMobile && {
                        top: "50%", // Altera o `top` apenas no mobile
                        padding: "1rem", // Ajusta o padding somente no mobile
                        width: "90%", // Ajusta a largura para mobile
                    }),
                }}
            >
                <Typography
                    {...(isMobile && {
                        fontSize: "0.875rem", // Ajusta a fonte só no mobile
                        lineHeight: "1.5", // Ajusta a altura da linha só no mobile
                    })}
                >
                    Bem-vindo ao New Level, um espaço dedicado aos verdadeiros amantes do metal que viveram a intensidade dos anos 80 na região do ABC, mais especificamente em Santo André. Aqui, a paixão pela música pesada e as memórias de uma época única se encontram para celebrar a cultura headbanger.

                    Nossa história começa com as experiências marcantes de um jovem na cena metal daquela época. Meu pai, junto com seus companheiros headbangers, trilhava os caminhos do Celtic Frost, Slayer, Whiplash, Exodus e muitos outros ícones do metal. As histórias de brigas épicas e shows inesquecíveis eram compartilhadas, criando uma teia de conexões que se estendia além da música.

                    Hoje, mergulhado no mundo da programação, surgiu a ideia de criar este espaço para unir os headbangers das antigas. Este site, concebido sem grandes planejamentos, busca resgatar as raízes do metal e reacender as lembranças nostálgicas daquela época dourada. Mais do que um simples portal, é um convite para reviver as emoções, relembrar as vivências e conectar-se novamente com a cultura que moldou tantas histórias.

                    Explore nossas páginas e embarque em uma jornada pela essência do metal. Seja revivendo as lendárias batalhas de mosh pit, relembrando as letras que ecoavam pelas ruas do ABC, ou simplesmente compartilhando suas próprias histórias, New Level é o lugar onde a comunidade headbanger se encontra para celebrar o passado e construir novas conexões no presente.
                </Typography>
                <Box p="3rem" {...(isMobile && { p: "1.5rem" })}>
                    <Button
                        onClick={skipApresentation}
                        sx={{
                            backgroundColor: "#3a100b",
                            color: "white",
                            ...(isMobile && {
                                width: "100%", // Botão ocupa 100% da largura só no mobile
                                padding: "0.75rem", // Ajusta o padding só no mobile
                            }),
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
