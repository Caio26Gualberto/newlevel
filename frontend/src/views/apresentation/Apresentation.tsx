import { Box, Button, Typography } from '@mui/material'
import CelticFrost from '../../assets/Celtif_Frost.jpg'

const Apresentation = () => {
    return (<>
        <Box component="img" position="fixed" width="100%" height="100%" sx={{ opacity: "1" }} src={CelticFrost} alt="Celtic Frost" />
        <Box position="absolute" top="60%" left="50%" color="white" textAlign="center" sx={{ transform: "translate(-50%, -50%)" }}>
            <Typography>
                Bem-vindo ao New Level, um espaço dedicado aos verdadeiros amantes do metal que viveram a intensidade dos anos 80 na região do ABC, mais especificamente em Santo André. Aqui, a paixão pela música pesada e as memórias de uma época única se encontram para celebrar a cultura headbanger.

                Nossa história começa com as experiências marcantes de um jovem na cena metal daquela época. Meu pai, junto com seus companheiros headbangers, trilhava os caminhos do Celtic Frost, Slayer, Whiplash, Exodus e muitos outros ícones do metal. As histórias de brigas épicas e shows inesquecíveis eram compartilhadas, criando uma teia de conexões que se estendia além da música.

                Hoje, mergulhado no mundo da programação, surgiu a ideia de criar este espaço para unir os headbangers das antigas. Este site, concebido sem grandes planejamentos, busca resgatar as raízes do metal e reacender as lembranças nostálgicas daquela época dourada. Mais do que um simples portal, é um convite para reviver as emoções, relembrar as vivências e conectar-se novamente com a cultura que moldou tantas histórias.

                Explore nossas páginas e embarque em uma jornada pela essência do metal. Seja revivendo as lendárias batalhas de mosh pit, relembrando as letras que ecoavam pelas ruas do ABC, ou simplesmente compartilhando suas próprias histórias, New Level é o lugar onde a comunidade headbanger se encontra para celebrar o passado e construir novas conexões no presente.
            </Typography>
            <Box p="3rem">
                <Button sx={{ backgroundColor: "#3a100b", color: "white" }}>Começar</Button>
            </Box>
        </Box>
    </>
    )
}

export default Apresentation
