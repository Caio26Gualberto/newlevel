import { 
  Avatar, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container,
  Divider, 
  Grid, 
  IconButton,
  ImageList, 
  ImageListItem, 
  ImageListItemBar,
  LinearProgress, 
  Link, 
  Paper, 
  Tab, 
  Tabs, 
  Typography, 
  useTheme, 
  useMediaQuery,
  Fade,
  Chip,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import VerifiedIcon from '@mui/icons-material/Verified';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CommentIcon from '@mui/icons-material/Comment';
import SpotifyIcon from '@mui/icons-material/LibraryMusic';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { BandApi, BandInfoByUser, ProfileInfoDto, UserApi } from '../../gen/api/src';
import ApiConfiguration from '../../config/apiConfig';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import VideoPlayer from '../../components/common/VideoPlayer';
import CommentsModal from '../../components/modals/CommentsModal';
import IntegrantsSection from '../../components/profile/IntegrantsSection';
import { useAuth } from '../../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const Profile = () => {
  const userService = new UserApi(ApiConfiguration);
  const bandService = new BandApi(ApiConfiguration);
  const { nickname, id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isBand } = useAuth();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [commentsModal, setCommentsModal] = useState({ 
    open: false, 
    photoId: 0, 
    mediaId: 0, 
    title: "", 
    type: "photo" as "photo" | "video" 
  });
  const [data, setData] = useState<ProfileInfoDto>({ 
    band: undefined, 
    cityName: "", 
    avatarUrl: "", 
    name: "", 
    profileInfoPhotos: [], 
    profileInfoVideos: [] 
  });
  const [dataForUserWithBand, setDataForUserWithBand] = useState<BandInfoByUser>({ 
    bandName: "", 
    bandProfileURL: "" 
  });
  const [value, setValue] = useState(0);

  useEffect(() => {
    setFadeIn(true);
    loadProfileData();
  }, [nickname, id]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileResponse, bandResponse] = await Promise.all([
        userService.apiUserGetProfileGet({ nickname: nickname, userId: Number(id) }),
        bandService.apiBandGetBandByUserGet()
      ]);

      if (profileResponse.isSuccess) {
        setData(profileResponse.data!);
      } else {
        console.error('Error loading profile:', profileResponse.message);
      }

      if (bandResponse.isSuccess) {
        setDataForUserWithBand(bandResponse.data!);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePanel = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleOpenComments = (id: number, title: string, type: "photo" | "video") => {
    if (type === "photo") {
      setCommentsModal({ open: true, photoId: id, mediaId: 0, title, type });
    } else {
      setCommentsModal({ open: true, photoId: 0, mediaId: id, title, type });
    }
  };

  const handleCloseComments = () => {
    setCommentsModal({ open: false, photoId: 0, mediaId: 0, title: "", type: "photo" });
  };

  const renderBandInfo = (): JSX.Element | null => {
    if (!data.band) return null;

    if (!isBand() && dataForUserWithBand.bandName) {
      return (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Link
            href={dataForUserWithBand.bandProfileURL!}
            underline="none"
            color="primary"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "bold",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "secondary.main",
                transform: "scale(1.05)"
              }
            }}
          >
            {dataForUserWithBand.bandName}
            <LinkIcon sx={{ fontSize: 16 }} />
          </Link>
        </Box>
      );
    }

    return null;
  };

  const MediaSkeleton = () => (
    <ImageListItem>
      <Skeleton variant="rectangular" height={164} />
    </ImageListItem>
  );

  const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  return (
    <>
      <LoadingSpinner isLoading={loading} />
      
      {/* Comments Modal */}
      <CommentsModal 
        open={commentsModal.open}
        onClose={handleCloseComments}
        photoId={commentsModal.photoId || undefined}
        mediaId={commentsModal.mediaId || undefined}
        title={commentsModal.title}
      />
      
      <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
        <Fade in={fadeIn} timeout={800}>
          <Box>
            {/* Banner Section */}
            <Paper
              elevation={8}
              sx={{
                height: { xs: '30vh', sm: '35vh', md: '45vh' },
                position: 'relative',
                mb: 0,
                borderRadius: 3,
                overflow: 'visible'
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: data.banner?.url ? `url(${data.banner.url})` : 'none',
                  backgroundColor: data.banner?.url ? 'transparent' : 'grey.300',
                  backgroundSize: 'cover',
                  backgroundPosition: `center ${data.banner?.position || 50}%`,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)'
                  }
                }}
              />

              {/* Avatar */}
              <Avatar
                src={data.avatarUrl || undefined}
                sx={{
                  width: { xs: 120, sm: 150, md: 200 },
                  height: { xs: 120, sm: 150, md: 200 },
                  position: 'absolute',
                  left: { xs: 20, sm: 30, md: 50 },
                  bottom: { xs: -60, sm: -75, md: -100 },
                  border: '4px solid white',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  zIndex: 10
                }}
              >
                {!data.avatarUrl && data.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Paper>

            {/* Profile Content */}
            <Paper
              elevation={8}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}
            >
              <Box sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
                {/* Profile Header */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    pl: { xs: 0, md: '15%' },
                    gap: 2,
                    mb: 4
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
                        }}
                      >
                        {data.name}
                      </Typography>
                      
                      {data.band?.isVerified && (
                        <VerifiedIcon color="primary" sx={{ fontSize: '2rem' }} />
                      )}
                      
                      {data.isEnabledToEdit && (
                        <IconButton
                          onClick={handleToggleEdit}
                          color={isEditing ? 'success' : 'primary'}
                          sx={{ ml: 1 }}
                        >
                          {isEditing ? <SaveAsIcon /> : <EditIcon />}
                        </IconButton>
                      )}
                    </Box>
                    
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      📍 {data.cityName}
                    </Typography>
                  </Box>

                  {/* Social Media Icons */}
                  {data.band && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {data.band.instagramUrl && (
                        <IconButton
                          component="a"
                          href={data.band.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: '#E1306C' }}
                        >
                          <InstagramIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
                        </IconButton>
                      )}
                      {data.band.youtubeUrl && (
                        <IconButton
                          component="a"
                          href={data.band.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: '#FF0000' }}
                        >
                          <YouTubeIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
                        </IconButton>
                      )}
                      {data.band.spotifyUrl && (
                        <IconButton
                          component="a"
                          href={data.band.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: '#1DB954' }}
                        >
                          <SpotifyIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
                        </IconButton>
                      )}
                    </Box>
                  )}
                </Box>
              {/* Band Info Section */}
              {data.band && (
                <Box sx={{ mb: 4 }}>
                  {/* Band Description Accordion */}
                  {data.band.description && (
                    <Accordion 
                      sx={{ 
                        mb: 2,
                        borderRadius: 2,
                        '&:before': { display: 'none' },
                        boxShadow: 2
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          bgcolor: 'rgba(211, 47, 47, 0.05)',
                          borderLeft: '4px solid',
                          borderColor: 'primary.main',
                          '&:hover': {
                            bgcolor: 'rgba(211, 47, 47, 0.1)'
                          }
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: 'primary.main'
                          }}
                        >
                          📝 Descrição da Banda
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 3 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            lineHeight: 1.7,
                            fontStyle: 'italic'
                          }}
                        >
                          {data.band.description}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  )}
                                    {/* Band Members Accordion */}
                                    {data.band?.integrantsWithUrl && data.band.integrantsWithUrl.length > 0 && (
                    <Accordion 
                      sx={{ 
                        mb: 2,
                        borderRadius: 2,
                        '&:before': { display: 'none' },
                        boxShadow: 2
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          bgcolor: 'rgba(211, 47, 47, 0.05)',
                          borderLeft: '4px solid',
                          borderColor: 'primary.main',
                          '&:hover': {
                            bgcolor: 'rgba(211, 47, 47, 0.1)'
                          }
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: 'primary.main'
                          }}
                        >
                          👥 Integrantes da Banda ({data.band.integrantsWithUrl.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 3 }}>
                        <IntegrantsSection
                          integrants={data.band.integrants || undefined}
                          integrantsWithUrl={data.band.integrantsWithUrl}
                        />
                      </AccordionDetails>
                    </Accordion>
                  )}

                {/* Band Details Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {/* Music Genres */}
                  {data.band?.musicGenres && data.band.musicGenres.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <MusicNoteIcon sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Gêneros Musicais
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {data.band.musicGenres.map((genre, index) => (
                            <Chip
                              key={index}
                              label={genre}
                              variant="outlined"
                              sx={{
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                '&:hover': {
                                  bgcolor: 'primary.main',
                                  color: 'white'
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                  )}

                  {/* Creation Date */}
                  {data.band?.createdAt && (
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CalendarTodayIcon sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Banda desde
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            color: 'text.secondary'
                          }}
                        >
                          {new Date(data.band.createdAt).toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Content Grid */}
            <Grid container spacing={4}>
              {/* Media Section */}
              <Grid item xs={12} lg={8}>
                <Paper
                  elevation={4}
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                      value={value}
                      onChange={handleChangePanel}
                      variant="fullWidth"
                      indicatorColor="primary"
                      textColor="primary"
                    >
                      <Tab
                        icon={<PhotoLibraryIcon />}
                        label="Fotos"
                        iconPosition="start"
                        sx={{ fontWeight: 'bold' }}
                      />
                      <Tab
                        icon={<VideoLibraryIcon />}
                        label="Vídeos"
                        iconPosition="start"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Tabs>
                  </Box>

                  <TabPanel value={value} index={0}>
                    {data.profileInfoPhotos?.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <PhotoLibraryIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          Nenhuma foto publicada ainda
                        </Typography>
                      </Box>
                    ) : (
                      <ImageList
                        sx={{ width: '100%', minHeight: 400 }}
                        cols={isMobile ? 2 : 3}
                        gap={8}
                        rowHeight={164}
                      >
                        {loading ? (
                          Array.from({ length: 6 }).map((_, index) => (
                            <MediaSkeleton key={index} />
                          ))
                        ) : (
                          data.profileInfoPhotos!.map((item, index) => (
                            <ImageListItem 
                              key={index} 
                              sx={{ 
                                position: 'relative',
                                borderRadius: 2,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: '0 12px 24px rgba(211, 47, 47, 0.3)',
                                  '& .photo-border': {
                                    borderColor: '#d32f2f',
                                    boxShadow: '0 0 20px rgba(211, 47, 47, 0.4)'
                                  },
                                  '& .comment-fab': {
                                    opacity: 1,
                                    transform: 'scale(1)'
                                  }
                                }
                              }}
                            >
                              <img
                                src={item.photoSrc || undefined}
                                alt={item.title || undefined}
                                loading="lazy"
                                className="photo-border"
                                style={{ 
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  borderRadius: 8,
                                  border: '2px solid rgba(255, 255, 255, 0.8)',
                                  transition: 'all 0.3s ease',
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                }}
                              />
                              
                              {/* Metal-style corner accents */}
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  left: 8,
                                  width: 0,
                                  height: 0,
                                  borderTop: '12px solid #d32f2f',
                                  borderRight: '12px solid transparent',
                                  opacity: 0.8
                                }}
                              />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: 8,
                                  right: 8,
                                  width: 0,
                                  height: 0,
                                  borderBottom: '12px solid #ff6b6b',
                                  borderLeft: '12px solid transparent',
                                  opacity: 0.8
                                }}
                              />
                              
                              {/* Floating comment button */}
                              <Box
                                className="comment-fab"
                                sx={{
                                  position: 'absolute',
                                  top: 12,
                                  right: 12,
                                  opacity: 0,
                                  transform: 'scale(0.8)',
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenComments(item.id!, item.title!, "photo");
                                  }}
                                  sx={{
                                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                                    color: 'white',
                                    width: 32,
                                    height: 32,
                                    '&:hover': {
                                      bgcolor: '#d32f2f',
                                      transform: 'scale(1.1)'
                                    },
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(4px)'
                                  }}
                                >
                                  <CommentIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Box>
                              
                              {/* Title overlay */}
                              <ImageListItemBar
                                title={item.title}
                                sx={{
                                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                                  '& .MuiImageListItemBar-title': {
                                    fontSize: '0.875rem',
                                    fontWeight: 'bold',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                                  }
                                }}
                              />
                            </ImageListItem>
                          ))
                        )}
                      </ImageList>
                    )}
                  </TabPanel>

                  <TabPanel value={value} index={1}>
                    {data.profileInfoVideos?.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <VideoLibraryIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          Nenhum vídeo publicado ainda
                        </Typography>
                      </Box>
                    ) : (
                      <Grid container spacing={2} sx={{ p: 2 }}>
                        {loading ? (
                          Array.from({ length: 6 }).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                            </Grid>
                          ))
                        ) : (
                          data.profileInfoVideos!.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Box sx={{ position: 'relative' }}>
                                <VideoPlayer
                                  videoUrl={item.mediaSrc!}
                                  title={item.title!}
                                  height={200}
                                />
                                <IconButton
                                  onClick={() => handleOpenComments(item.id!, item.title!, "video")}
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                                    color: 'white',
                                    '&:hover': {
                                      bgcolor: 'rgba(0, 0, 0, 0.8)',
                                      transform: 'scale(1.1)'
                                    },
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  <CommentIcon />
                                </IconButton>
                              </Box>
                            </Grid>
                          ))
                        )}
                      </Grid>
                    )}
                  </TabPanel>
                </Paper>
              </Grid>

              {/* Side Panel */}
              <Grid item xs={12} lg={4}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    textAlign: 'center',
                    height: 'fit-content'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Novidades em Breve
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Estamos preparando algo especial baseado em sugestões da comunidade
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={25} 
                    sx={{ 
                      mb: 2,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'primary.main'
                      }
                    }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    25% Completo
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Fade>
  </Container>
    </>
  );
};

export default Profile;
