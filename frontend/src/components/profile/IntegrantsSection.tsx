import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Link,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import {
  Group,
  Link as LinkIcon,
  MusicNote
} from '@mui/icons-material';
import { IntegrantInfoDto } from '../../gen/api/src';

interface IntegrantsSectionProps {
  integrants?: { [key: string]: string };
  integrantsWithUrl?: IntegrantInfoDto[] | null;
}

const IntegrantsSection: React.FC<IntegrantsSectionProps> = ({ 
  integrants, 
  integrantsWithUrl 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Se não há integrantes, não renderiza nada
  if ((!integrants || Object.keys(integrants).length === 0) && 
      (!integrantsWithUrl || integrantsWithUrl.length === 0)) {
    return null;
  }

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 4,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid rgba(211, 47, 47, 0.1)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Group sx={{ color: 'primary.main', mr: 1, fontSize: '1.5rem' }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            color: 'primary.main'
          }}
        >
          Integrantes da Banda
        </Typography>
      </Box>

      <Stack spacing={2}>
        {/* Integrantes sem URL (não confirmados) */}
        {integrantsWithUrl?.length === 0 && integrants && Object.entries(integrants).map(([member, instrument], index) => (
          <Box
            key={`simple-${index}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(211, 47, 47, 0.05)',
              border: '1px solid rgba(211, 47, 47, 0.1)',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 }
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'grey.300',
                color: 'text.secondary',
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 }
              }}
            >
              {member.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                {member}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 0.5 }}>
                <MusicNote sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  {instrument}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}

        {/* Integrantes com URL (confirmados) */}
        {integrantsWithUrl && integrantsWithUrl.map((integrant, index) => (
          <Box
            key={`confirmed-${index}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(76, 175, 80, 0.05)',
              border: '1px solid rgba(76, 175, 80, 0.2)',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 },
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)'
              }
            }}
          >
            <Avatar
              src={integrant.avatarUrl || undefined}
              sx={{
                bgcolor: 'success.main',
                color: 'white',
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 }
              }}
            >
              {integrant.name?.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
              <Link
                href={integrant.profileUrl || undefined}
                underline="none"
                color="primary"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontWeight: 'bold',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'secondary.main',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {integrant.name}
                <LinkIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
              </Link>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 0.5, mt: 0.5 }}>
                <MusicNote sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  {integrant.instrument}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default IntegrantsSection;
