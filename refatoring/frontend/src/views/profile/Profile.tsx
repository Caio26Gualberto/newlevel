import { Avatar, Box, Button, Card, CardContent, Divider, Grid, Icon, ImageList, ImageListItem, ImageListItemBar, LinearProgress, Link, ListSubheader, Paper, Tab, Tabs, Tooltip, Typography, useTheme, useMediaQuery } from '@mui/material'
import React from 'react'
import EditIcon from '@mui/icons-material/Edit';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useParams } from 'react-router-dom';
import { BandApi, BandInfoByUser, ProfileInfoDto, UserApi } from '../../gen/api/src';
import ApiConfiguration from '../../apiConfig';
import NewLevelLoading from '../../components/NewLevelLoading';
import Swal from 'sweetalert2';
import IntegrantsDialog from './components/IntegrantsDialog';
import * as toastr from 'toastr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import MediaListProfile from './components/ImageListProfile';
import LinkIcon from '@mui/icons-material/Link';
import { useAuth } from '../../AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const Profile = () => {
  const userService = new UserApi(ApiConfiguration)
  const bandService = new BandApi(ApiConfiguration)
  const { nickname, id } = useParams();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [data, setData] = React.useState<ProfileInfoDto>({ band: undefined, cityName: "", avatarUrl: "", name: "", profileInfoPhotos: [], profileInfoVideos: [] });
  const [dataForUserWithBand, setDataForUserWithBand] = React.useState<BandInfoByUser>({ bandName: "", bandProfileURL: "" });
  const [value, setValue] = React.useState(0);
  const { isBand } = useAuth()
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChangePanel = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleToggleEdit = () => {
    setIsEditing(prevIsEditing => {
      const newIsEditing = !prevIsEditing;
      if (newIsEditing) {
        toastr.info(`Edição Ativada`, 'Aviso', {
          timeOut: 3000,
          progressBar: true,
          positionClass: "toast-bottom-right"
        });
      } else {
        toastr.success(`Salvo com sucesso`, 'Salvo!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: "toast-bottom-right"
        });
      }

      return newIsEditing;
    });
  };

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await userService.apiUserGetProfileGet({ nickname: nickname, userId: id });
        const response2 = await bandService.apiBandGetBandByUserGet()

        if (response.isSuccess) {
          setData(response.data!);
        } else {
          Swal.fire({
            title: 'Erro',
            text: response.message,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }

        if (response2.isSuccess) {
          setDataForUserWithBand(response2.data!);
        } else {
          Swal.fire({
            title: 'Erro',
            text: response2.message,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }

      } catch (error) {

      } finally {
        setLoading(false);
      }
    })();
  }, [nickname, id]);

  const renderizeSecondaryInfos = (): JSX.Element | null => {
    if (data.band && (!data.band.integrantsWithUrl || data.band.integrantsWithUrl.length === 0)) {
      return (
        <Box>
          <IntegrantsDialog data={data.band.integrants!} title='Integrantes' />
        </Box>
      );
    } else if (!isBand() && data.band) {
      return (
        <>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
              <strong>
                <Link
                  href={dataForUserWithBand.bandProfileURL!}
                  underline="none"
                  color="primary"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: "bold",
                    transition: "color 0.3s ease, transform 0.3s ease",
                    "&:hover": {
                      color: "red",
                      textDecoration: "underline",
                      transform: "scale(1.05)"
                    }
                  }}
                >
                  {dataForUserWithBand.bandName}
                  <LinkIcon sx={{ fontSize: 16 }} />
                </Link>
              </strong>
            </Typography>
          </Box>
        </>
      );
    } else if (data.band && data.band.integrantsWithUrl && data.band.integrantsWithUrl.length > 0) {
      return (
        <Box>
          <IntegrantsDialog data={data.band.integrants!} dataWithUrl={data.band.integrantsWithUrl} title='Integrantes' />
        </Box>
      );
    } else if (!data.band) {
      return (
        <></>
      );
    }

    return null;
  };

  return (
    <>
      <NewLevelLoading isLoading={loading} />
      <Box 
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: {
            xs: 1,
            sm: 2,
            md: 3
          }
        }}
      >
        {/* Banner Section */}
        <Paper 
          elevation={10} 
          sx={{ 
            height: {
              xs: "30vh",
              sm: "35vh",
              md: "45vh"
            },
            width: {
              xs: "100%",
              sm: "90%",
              md: "80%",
              lg: "70%"
            },
            position: "relative", 
            mb: {
              xs: 1,
              sm: 2,
              md: 3
            },
            boxShadow: 0 
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${data.banner?.url || ''})`,
              backgroundColor: data.banner?.url ? "transparent" : "lightgray",
              backgroundSize: "cover",
              backgroundPosition: `center ${data.banner?.position}%`,
              borderRadius: 2,
            }}
          />

          {/* Avatar */}
          <Box 
            sx={{
              position: "absolute",
              left: {
                xs: "20px",
                sm: "30px",
                md: "50px"
              },
              bottom: {
                xs: "-60px",
                sm: "-80px",
                md: "-100px"
              }
            }}
          >
            <Avatar
              src={data.avatarUrl}
              alt="Profile"
              sx={{
                width: {
                  xs: "120px",
                  sm: "150px",
                  md: "200px"
                },
                height: {
                  xs: "120px",
                  sm: "150px",
                  md: "200px"
                },
                border: "3px solid #fff",
              }}
            />
          </Box>
        </Paper>

        {/* Profile Content */}
        <Paper 
          elevation={10} 
          sx={{ 
            width: {
              xs: "100%",
              sm: "90%",
              md: "80%",
              lg: "70%"
            },
            p: {
              xs: 2,
              sm: 3,
              md: 4
            },
            mt: {
              xs: 6,
              sm: 8,
              md: 10
            },
            minHeight: "40vh" 
          }}
        >
          {/* Profile Header */}
          <Box 
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row"
              },
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                md: "center"
              },
              pl: {
                xs: 0,
                sm: "15%",
                md: "20%"
              },
              gap: {
                xs: 2,
                md: 0
              }
            }}
          >
            <Box>
              <Box 
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row"
                  },
                  alignItems: {
                    xs: "flex-start",
                    sm: "center"
                  },
                  gap: 1
                }}
              >
                <Typography 
                  variant="h4"
                  sx={{
                    fontSize: {
                      xs: "1.5rem",
                      sm: "2rem",
                      md: "2.125rem"
                    }
                  }}
                >
                  {data.name}
                </Typography>
                <Box 
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  {data.band?.isVerified && (
                    <Icon color='primary' sx={{ fontSize: "1.5rem" }}>
                      <VerifiedIcon />
                    </Icon>
                  )}
                  {data.isEnabledToEdit && !isEditing && (
                    <Icon 
                      onClick={handleToggleEdit} 
                      color='primary' 
                      sx={{ cursor: "pointer", fontSize: "1.5rem" }}
                    >
                      <EditIcon />
                    </Icon>
                  )}
                  {data.isEnabledToEdit && isEditing && (
                    <Icon 
                      onClick={handleToggleEdit} 
                      color='success' 
                      sx={{ cursor: "pointer", fontSize: "1.5rem" }}
                    >
                      <SaveAsIcon />
                    </Icon>
                  )}
                </Box>
              </Box>
              <Typography 
                variant="subtitle1"
                sx={{
                  fontSize: {
                    xs: "0.875rem",
                    sm: "1rem"
                  }
                }}
              >
                {data.cityName}
              </Typography>
            </Box>

            {/* Social Media Icons */}
            <Box 
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                width: {
                  xs: "100%",
                  md: "20%"
                },
                gap: 2
              }}
            >
              {data.band?.spotifyUrl && (
                <FontAwesomeIcon 
                  size={isMobile ? 'lg' : 'xl'} 
                  color='green' 
                  icon={faSpotify} 
                />
              )}
              {data.band?.youtubeUrl && (
                <FontAwesomeIcon 
                  size={isMobile ? 'lg' : 'xl'} 
                  color='#c4302b' 
                  icon={faYoutube} 
                />
              )}
              {data.band?.instagramUrl && (
                <FontAwesomeIcon 
                  size={isMobile ? 'lg' : 'xl'} 
                  color='#E1306C' 
                  icon={faInstagram} 
                />
              )}
            </Box>
          </Box>

          {/* Band Description */}
          {data.band && (
            <Box 
              sx={{
                mt: {
                  xs: 2,
                  sm: 3
                },
                p: {
                  xs: 1,
                  sm: 2
                }
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: "0.875rem",
                    sm: "1rem"
                  },
                  lineHeight: 1.5
                }}
              >
                {data.band.description}
              </Typography>
            </Box>
          )}

          {/* Main Content Grid */}
          <Box 
            sx={{
              mt: {
                xs: 3,
                sm: 4,
                md: 5
              }
            }}
          >
            <Grid container spacing={2}>
              {/* Left Column - Photos/Videos */}
              <Grid item xs={12} md={4}>
                <Card elevation={4} sx={{ backgroundColor: "#F0F0F0", height: "100%" }}>
                  <CardContent>
                    {renderizeSecondaryInfos()}
                    <Tabs 
                      value={value}
                      onChange={handleChangePanel}
                      aria-label="basic tabs example"
                      variant="fullWidth"
                      indicatorColor="primary"
                      textColor="primary"
                      centered
                      sx={{
                        '& .MuiTab-root': {
                          fontSize: {
                            xs: '0.75rem',
                            sm: '0.875rem'
                          }
                        }
                      }}
                    >
                      <Tab 
                        label={
                          <Typography fontWeight="bold" variant="body2">
                            Fotos
                          </Typography>
                        } 
                        {...a11yProps(0)} 
                      />
                      <Tab 
                        label={
                          <Typography fontWeight="bold" variant="body2">
                            Vídeos
                          </Typography>
                        } 
                        {...a11yProps(1)} 
                      />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                      {data.profileInfoPhotos?.length == 0 && (
                        <Typography fontWeight="bold" variant="body2">
                          Este usuário ainda não publicou fotos
                        </Typography>
                      )}
                      <ImageList 
                        sx={{ 
                          width: '100%', 
                          minHeight: {
                            xs: 300,
                            sm: 400,
                            md: 450
                          }
                        }} 
                        cols={isSmallMobile ? 2 : 3}
                        gap={8} 
                        rowHeight={164}
                      >
                        {data.profileInfoPhotos!.map((item) => (
                          <MediaListProfile key={item.photoSrc} src={item.photoSrc!} title={item.title!} isVideo={false} />
                        ))}
                      </ImageList>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      {data.profileInfoVideos?.length == 0 && (
                        <Typography fontWeight="bold" variant="body2">
                          Este usuário ainda não publicou vídeos
                        </Typography>
                      )}
                      <ImageList 
                        sx={{ 
                          width: '100%', 
                          minHeight: {
                            xs: 300,
                            sm: 400,
                            md: 450
                          }
                        }} 
                        cols={isSmallMobile ? 2 : 3}
                        gap={8} 
                        rowHeight={164}
                      >
                        {data.profileInfoVideos!.map((item) => (
                          <MediaListProfile key={item.id} src={item.mediaSrc!} title={item.title!} isVideo />
                        ))}
                      </ImageList>
                    </TabPanel>
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Column - Coming Soon */}
              <Grid item xs={12} md={8}>
                <Card elevation={4} sx={{ backgroundColor: "#F0F0F0", height: "100%" }}>
                  <CardContent>
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{
                          fontSize: {
                            xs: "1rem",
                            sm: "1.25rem",
                            md: "1.5rem"
                          }
                        }}
                      >
                        Estamos preparando algo baseado em sugestões do público
                      </Typography>
                      <LinearProgress variant="query" value={10} />
                      <Typography 
                        fontWeight="bold" 
                        variant="body1" 
                        sx={{ 
                          marginTop: 2,
                          fontSize: {
                            xs: "0.875rem",
                            sm: "1rem"
                          }
                        }}
                      >
                        {10}% Completo
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </>
  );
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
        <Box 
          sx={{
            p: {
              xs: 1,
              sm: 2,
              md: 3
            }
          }}
        >
          <Typography>{children}</Typography>
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

export default Profile