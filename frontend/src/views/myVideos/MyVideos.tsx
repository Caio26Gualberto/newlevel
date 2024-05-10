import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Paper, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from "react";

const Data = [
  { keyForPanel: "1", title: "Título 1", description: "Descrição 1", videoUrl: "" },
  { keyForPanel: "2", title: "Título 2", description: "Descrição 2", videoUrl: "" },
  { keyForPanel: "3", title: "Título 3", description: "Descrição 3", videoUrl: "" },
  { keyForPanel: "4", title: "Título 4", description: "Descrição 4", videoUrl: "" },
  { keyForPanel: "4", title: "Título 5", description: "Descrição 5", videoUrl: "" },
  { keyForPanel: "4", title: "Título 4", description: "Descrição 4", videoUrl: "" },
  { keyForPanel: "4", title: "Título 4", description: "Descrição 4", videoUrl: "" },
  { keyForPanel: "4", title: "Título 4", description: "Descrição 4", videoUrl: "" },
  { keyForPanel: "4", title: "Título 4", description: "Descrição 4", videoUrl: "" },
  // Adicione mais exemplos conforme necessário
];

const MyVideos = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
      <Paper elevation={4} sx={{ width: "80%", height: "auto" }}>
        {Data.map((data) => (
          <Accordion expanded={expanded === `panel${data.keyForPanel}`} onChange={handleChange(`panel${data.keyForPanel}`)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${data.keyForPanel}bh-content`}
              id={`panel${data.keyForPanel}bh-header`}
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                {data.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex">
                  <iframe width="360" height="200" src="https://www.youtube.com/embed/1BXkSLZv0qg" title={data.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin" allowFullScreen style={{ border: "0px", borderRadius: "10px" }}></iframe>
                  <Divider orientation="vertical" flexItem sx={{ marginLeft: "16px" }} />
                  <Box display="flex" alignItems="center" ml={5}>
                    <Typography noWrap>
                      {data.description}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="center" height="100%">
                  <Button>Editar</Button>
                  <Button>Excluir</Button>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  )
}

export default MyVideos
