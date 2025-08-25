import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ForumIcon from '@mui/icons-material/Forum';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import PictureProfileModal from './modal/PictureProfileModal';
import CommentsModal from './modal/CommentsModal';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

interface CardPhotoProps {
  photoId: number;
  userId: string;
  title: string;
  srcPhotoS3: string;
  srcUserPhotoProfile?: string;
  date: Date;
  subtitle: string;
  description?: string;
  nickname?: string;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CardPhoto: React.FC<CardPhotoProps> = ({ title, srcPhotoS3, srcUserPhotoProfile, date, subtitle, description, userId, nickname, photoId }) => {
  const haveDescription = description ? true : false;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [expanded, setExpanded] = React.useState(false);
  const [openAvatar, setOpenAvatar] = React.useState(false);
  const [openComments, setOpenComments] = React.useState(false);

  const handleClickOpenAvatar = () => {
    setOpenAvatar(true);
  }

  const handleOpenComments = () => {
    setOpenComments(true);
  }

  const handleCloseComments = () => {
    setOpenComments(false);
  }

  const handleCloseAvatar = () => {
    setOpenAvatar(false);
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const openImage = () => {
    window.open(srcPhotoS3, '_blank');
  };

  const renderizeAvatar = () => {
    if (srcUserPhotoProfile) {
      return <Avatar src={srcUserPhotoProfile} onClick={handleClickOpenAvatar} sx={{ cursor: "pointer" }} aria-label="recipe">
        R
      </Avatar>
    } else {
      return <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
        {nickname?.charAt(0)}
      </Avatar>
    }
  }

  return (
    <>
      {openComments && <CommentsModal open={true} onClose={handleCloseComments} photoId={photoId} />}
      <PictureProfileModal onClose={handleCloseAvatar} open={openAvatar} avatarUrl={srcUserPhotoProfile!} nickname={nickname!} />
      <Card
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          p: {
            xs: 1,
            sm: 1.5,
            md: 2
          }
        }}
      >
        <CardHeader
          avatar={renderizeAvatar()}
          title={
            <Typography 
              fontWeight="bold"
              sx={{
                fontSize: {
                  xs: "0.875rem",
                  sm: "1rem",
                  md: "1.125rem"
                }
              }}
            >
              {title}
            </Typography>
          }
          subheader={
            <Typography
              sx={{
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.875rem"
                }
              }}
            >
              {date.toLocaleDateString()}
            </Typography>
          }
          sx={{
            p: {
              xs: 1,
              sm: 1.5,
              md: 2
            }
          }}
        />
        <CardMedia
          onClick={openImage}
          sx={{
            cursor: 'pointer',
            height: {
              xs: '180px',
              sm: '220px',
              md: '250px',
              lg: '280px'
            },
            objectFit: 'cover',
            borderRadius: 1
          }}
          component="img"
          src={srcPhotoS3}
        />
        <CardContent
          sx={{
            flex: 1,
            p: {
              xs: 1,
              sm: 1.5,
              md: 2
            },
            minHeight: {
              xs: 'auto',
              sm: '80px',
              md: '109px'
            }
          }}
        >
          <Typography 
            paragraph 
            style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontSize: {
                xs: "0.75rem",
                sm: "0.875rem"
              },
              lineHeight: 1.4
            }}
          >
            {subtitle}
          </Typography>
        </CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
            mt: "auto"
          }}
        >
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: {
                xs: 'space-between',
                sm: 'flex-end'
              },
              p: {
                xs: 1,
                sm: 1.5,
                md: 2
              }
            }}
            disableSpacing
          >
            <IconButton 
              onClick={handleOpenComments} 
              aria-label="add to favorites"
              sx={{
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.5rem"
                }
              }}
            >
              <ForumIcon />
            </IconButton>
            {haveDescription && (
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                sx={{
                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.5rem"
                  }
                }}
              >
                <ExpandMoreIcon />
              </ExpandMore>
            )}
          </CardActions>
        </Box>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent
            sx={{
              p: {
                xs: 1,
                sm: 1.5,
                md: 2
              }
            }}
          >
            <Typography 
              paragraph 
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
              sx={{
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.875rem"
                },
                lineHeight: 1.4
              }}
            >
              {description}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
}

export default CardPhoto;
