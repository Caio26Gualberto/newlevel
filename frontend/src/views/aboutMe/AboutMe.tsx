import { Avatar, Box, Divider, Grid, IconButton, Typography } from "@mui/material"
import CaioImg from "../../assets/Perfil.jpg"
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const AboutMe = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="92.5vh" bgcolor="#F3F3F3">
      <Grid container m={5} bgcolor="white" borderRadius={2} height="90%">
        <Grid item xs={2} display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" mt={2}>
            <Avatar src={CaioImg} sx={{ width: "200px", height: "200px" }}></Avatar>
          </Box>
          <Box display="flex" justifyContent="center" mt={3}>
            <Box ml={2} display="flex" flexDirection="column" justifyContent="space-around">
              <Box display="flex" alignContent="center">
                <Typography>Instagram pessoal</Typography>
                <IconButton sx={{ marginTop: "-8px", color: "red" }} target="_blank" href="https://www.instagram.com/caio_gualbertoo/">
                  <InstagramIcon />
                </IconButton>
              </Box>
              <Box display="flex" alignContent="center">
                <Typography>Instagram NewLevel</Typography>
                <IconButton sx={{ marginTop: "-8px", color: "red" }} target="_blank" href="https://www.instagram.com/newlevelmusic_/">
                  <InstagramIcon />
                </IconButton>
              </Box>
              <Box display="flex" alignContent="center">
                <Typography>Github</Typography>
                <IconButton sx={{ marginTop: "-8px", color: "red" }} target="_blank" href="https://github.com/Caio26Gualberto">
                  <GitHubIcon />
                </IconButton>
              </Box>
              <Box display="flex" alignContent="center">
                <Typography>Linkedin</Typography>
                <IconButton sx={{ marginTop: "-8px", color: "red" }} target="_blank" href="https://www.linkedin.com/in/caio-faria-gualberto-50706019a/">
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Divider orientation="vertical" />
        <Grid item xs={9}>
          <Box m={2}>
            <Typography fontSize={17} fontWeight="bold" lineHeight={1.7}>
              Sejam todos bem-vindos! Meu nome é Caio, e se há algo que posso garantir é que música corre em minhas veias. Desde pequeno, fui imerso em um mundo de riffs de guitarra, batidas pesadas e letras que transcendem o comum.

              Cresci ouvindo Metal (Graças ao meu pai, Franco Gualberto). Bandas como Overkill, Slayer, Whiplash, Dark Angel, Exodus, Anthrax, e At War foram trilhas sonoras constantes da minha juventude. Mas, ao mesmo tempo, minha jornada musical foi enriquecida pelas influências do passado, graças ao meu avô. Paulo Sérgio, Vicente Celestino, Carlos Galhardo, Adoniran Barbosa, e muitos outros nomes ecoavam pelas paredes de nossa casa.

              Para mim, a música não é apenas uma paixão; é uma necessidade. Ela é a batida do meu coração e a energia que me impulsiona. E quando se trata de expressar essa paixão, nada supera o Metal e o bom e velho Rock. Desde jovem, tive a sorte de estar imerso na cena musical, frequentando estúdios e shows com meu pai e seus amigos. Cresci rodeado pela energia pulsante dos palcos, sempre acompanhado pelos veteranos da cena, como Fabrízio (Devastor) e Adriano (o Primo do Bode).

              À medida que amadureci, encontrei outra paixão: a programação. E pensei comigo mesmo, por que não unir minhas duas paixões em um único projeto? Foi assim que surgiu a ideia deste site, um espaço para compartilhar histórias, memórias e paixões musicais. Independentemente de ser um headbanger de carteirinha, um amante do Rock clássico, ou qualquer outra coisa, todos são bem-vindos para compartilhar suas experiências aqui.

              E isso é apenas o começo. Estou animado para o futuro, onde espero expandir este espaço para incluir a divulgação de bandas emergentes e até mesmo produzir podcasts com alguns dos grandes nomes do cenário musical. Então, se você é um amante da música como eu, junte-se a nós nesta jornada.

              Sejam bem-vindos ao nosso mundo sonoro!
            </Typography>
            <Typography mt={2}>Texto gerado pelo GPT &#128514; Porem baseado na minha história</Typography>
          </Box>
          <Box m={2}>
          </Box>
        </Grid>
        <Divider orientation="vertical" />
      </Grid>
    </Box>
  )
}

export default AboutMe
