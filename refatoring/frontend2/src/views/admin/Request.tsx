import { 
  Box, 
  Container,
  Tabs, 
  Tab, 
  Typography, 
  Paper, 
  useTheme, 
  useMediaQuery,
  Fade,
  Chip
} from '@mui/material';
import { useState } from 'react';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VideoRequest from './components/VideoRequest';
import PhotoRequest from './components/PhotoRequest';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

const Request: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [value, setValue] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  useState(() => {
    setFadeIn(true);
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
      <Fade in={fadeIn} timeout={800}>
        <Box>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <AdminPanelSettingsIcon 
                sx={{ 
                  fontSize: { xs: 32, md: 40 }, 
                  color: 'primary.main' 
                }} 
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b6b 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Painel Administrativo
              </Typography>
            </Box>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Gerencie solicitações de conteúdo da comunidade
            </Typography>
            <Chip
              label="Admin Only"
              color="primary"
              variant="outlined"
              sx={{ mt: 1, fontWeight: 'bold' }}
            />
          </Box>

          {/* Main Content */}
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
            }}
          >
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant={isMobile ? "fullWidth" : "standard"}
                indicatorColor="primary"
                textColor="primary"
                centered={!isMobile}
                sx={{
                  '& .MuiTab-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 'bold',
                    minHeight: { xs: 56, sm: 64 },
                    textTransform: 'none'
                  }
                }}
              >
                <Tab
                  icon={<VideoLibraryIcon />}
                  label="Solicitações de Vídeos"
                  iconPosition="start"
                  {...a11yProps(0)}
                />
                <Tab
                  icon={<PhotoLibraryIcon />}
                  label="Solicitações de Fotos"
                  iconPosition="start"
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>

            {/* Tab Panels */}
            <TabPanel value={value} index={0}>
              <VideoRequest />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <PhotoRequest />
            </TabPanel>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default Request;
