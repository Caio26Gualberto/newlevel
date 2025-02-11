import { Avatar, Box, Button, Card, CardContent, Divider, Grid, Icon, ImageList, ImageListItem, ImageListItemBar, LinearProgress, ListSubheader, Paper, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import React from 'react'
import Logo from "../../assets/Headbanger4.jpeg"
import EditIcon from '@mui/icons-material/Edit';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useParams } from 'react-router-dom';
import { ProfileInfoDto, UserApi } from '../../gen/api/src';
import ApiConfiguration from '../../apiConfig';
import NewLevelLoading from '../../components/NewLevelLoading';
import Swal from 'sweetalert2';
import IntegrantsDialog from './components/IntegrantsDialog';
import * as toastr from 'toastr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import MediaListProfile from './components/ImageListProfile';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const Profile = () => {
  const userService = new UserApi(ApiConfiguration)
  const { nickname, id } = useParams();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [data, setData] = React.useState<ProfileInfoDto>({ band: undefined, cityName: "", avatarUrl: "", name: "", profileInfoPhotos: [], profileInfoVideos: [] });
  const [value, setValue] = React.useState(0);

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
  }

  return (
    <>
      <NewLevelLoading isLoading={loading} />
      <Box width="100%" height="100%" display="flex" flexDirection="column" alignItems="center">
        <Paper elevation={10} sx={{ height: "45vh", width: "70%", position: "relative", mb: 2, boxShadow: 0 }}>
          <img
            src={Logo}
            alt="Banner"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: "4px",
            }}
          />
          <Box position="absolute" left="50px" bottom="-100px">
            <Avatar
              src={data.avatarUrl}
              alt="Profile"
              style={{
                width: "200px",
                height: "200px",
                border: "3px solid #fff",
              }}
            />
          </Box>
        </Paper>
        <Paper elevation={10} sx={{ width: "70%", p: 2, m: -1.9, minHeight: "40vh" }}>
          <Box display="flex" justifyContent="space-between" pl="20%">
            <Box>
              <Box display="flex" width="100%">
                <Typography variant="h4">{data.name}</Typography>
                {data.band?.isVerified && <Icon color='primary' sx={{ mt: 1.2, ml: 1 }}><VerifiedIcon /></Icon>}
                {data.isEnabledToEdit && !isEditing && <Icon onClick={handleToggleEdit} color='primary' sx={{ mt: 1.2, ml: 1, cursor: "pointer" }}><EditIcon /></Icon>}
                {data.isEnabledToEdit && isEditing && <Icon onClick={handleToggleEdit} color='success' sx={{ mt: 1.2, ml: 1, cursor: "pointer" }}><SaveAsIcon /></Icon>}
              </Box>
              <Typography variant="subtitle1">{data.cityName}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-evenly" width="20%">
              {data.band?.spotifyUrl && <FontAwesomeIcon size='xl' color='green' icon={faSpotify} />}
              {data.band?.youtubeUrl && <FontAwesomeIcon size='xl' color='#c4302b' icon={faYoutube} />}
              {data.band?.instagramUrl && <FontAwesomeIcon size='xl' color='#E1306C' icon={faInstagram} />}
            </Box>
          </Box>
          {
            data.band &&
            <Box mt={3}>
              {data.band.description}
            </Box>
          }
          <Box mt={5}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card elevation={4} sx={{ backgroundColor: "#F0F0F0" }}>
                  <CardContent>
                    {renderizeSecondaryInfos()}
                    <Tabs value={value}
                      onChange={handleChangePanel}
                      aria-label="basic tabs example"
                      variant="fullWidth"
                      indicatorColor="primary"
                      textColor="primary"
                      centered>
                      <Tab label={<Typography fontWeight="bold" variant="body2">Fotos</Typography>} {...a11yProps(0)} />
                      <Tab label={<Typography fontWeight="bold" variant="body2">Vídeos</Typography>} {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                      {data.profileInfoPhotos?.length == 0 && <Typography fontWeight="bold" variant="body2">Este usuário ainda não publicou fotos</Typography>}
                      <ImageList sx={{ width: '100%', minHeight: 450 }} cols={3} gap={8} rowHeight={164}>
                        {data.profileInfoPhotos!.map((item) => (
                          <MediaListProfile key={item.photoSrc} src={item.photoSrc!} title={item.title!} isVideo={false} />
                        ))}
                      </ImageList>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      {data.profileInfoVideos?.length == 0 && <Typography fontWeight="bold" variant="body2">Este usuário ainda não publicou vídeos</Typography>}
                      <ImageList sx={{ width: '100%', minHeight: 450 }} cols={3} gap={8} rowHeight={164}>
                        {data.profileInfoVideos!.map((item) => (
                          <MediaListProfile key={item.id} src={item.mediaSrc!} title={item.title!} isVideo />
                        ))}
                      </ImageList>
                    </TabPanel>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={8}>
                <Card elevation={4} sx={{ backgroundColor: "#F0F0F0", height: "100%" }}>
                  <CardContent>
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        Estamos preparando algo baseado em sugestões do público
                      </Typography>
                      <LinearProgress variant="query" value={10} />
                      <Typography fontWeight="bold" variant="body1" sx={{ marginTop: 2 }}>
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
        <Box p={3}>
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