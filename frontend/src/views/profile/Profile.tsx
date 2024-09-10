import { Avatar, Box, Button, Card, CardContent, Grid, Icon, ImageList, ImageListItem, Paper, Typography } from '@mui/material'
import React from 'react'
import Logo from "../../assets/Headbanger4.jpeg"
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useParams } from 'react-router-dom';
import { ProfileInfoDto, UserApi } from '../../gen/api/src';
import ApiConfiguration from '../../apiConfig';
import NewLevelLoading from '../../components/NewLevelLoading';
import Swal from 'sweetalert2';
import SimpleDialog from '../../views/videos/components/SimpleDialog';
import IntegrantsDialog from './components/IntegrantsDialog';

const Profile = () => {
  const userService = new UserApi(ApiConfiguration)
  const { nickname, id } = useParams();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showIntegrants, setShowIntegrants] = React.useState<boolean>(false);
  const [data, setData] = React.useState<ProfileInfoDto>({ artist: undefined, cityName: "", avatarUrl: "", name: "" });

  const handleClickOpen = () => {
    setShowIntegrants(true);
  };
  const handleClose = () => {
    setShowIntegrants(false);
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
    debugger
    if (data.artist) {
      return (
        <Box>
          <Button onClick={handleClickOpen} variant='contained' color='warning'>Ver Integrantes</Button>
          <IntegrantsDialog data={data.artist.integrants!} onClose={handleClose} open={showIntegrants} title='Integrantes' />
        </Box>
      );
    } else if (!data.artist) {
      return (
        <Box>
          <Typography variant="h6">{data.cityName}</Typography>
        </Box>
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
          <Box display="flex" justifyContent="space-between" alignItems="center" pl="20%">
            <Box>
              <Box display="flex">
                <Typography variant="h4">{data.name}</Typography>
                {data.artist?.isVerified && <Icon color='primary' sx={{ mt: 1.2, ml: 1, cursor: "pointer" }}><VerifiedIcon /></Icon>}
                {data.isEnabledToEdit && <Icon color='primary' sx={{ mt: 1.2, ml: 1, cursor: "pointer" }}><EditIcon /></Icon>}
              </Box>
              <Typography variant="subtitle1">{data.cityName}</Typography>
            </Box>
            {
              renderizeSecondaryInfos()
            }
          </Box>
          {
            data.artist &&
            <Box mt={3}>
              {data.artist.description}
            </Box>
          }
          <Box mt={5}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">Músicas</Typography>
                    <Typography variant="subtitle1">0</Typography>
                    {/* <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                      {itemData.map((item) => (
                        <ImageListItem key={item.img}>
                          <img
                            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                            alt={item.title}
                            loading="lazy"
                          />
                        </ImageListItem>
                      ))}
                    </ImageList> */}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">Músicas</Typography>
                    <Typography variant="subtitle1">0</Typography>
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

export default Profile