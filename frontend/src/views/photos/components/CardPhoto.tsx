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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ForumIcon from '@mui/icons-material/Forum';
import { Box } from '@mui/material';
import PictureProfileModal from './modal/PictureProfileModal';
import CommentsModal from './modal/CommentsModal';
import { useMobile } from '../../../MobileContext';

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
  const { isMobile } = useMobile()
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
          maxWidth: isMobile ? '100%' : 345,  // Full width em mobile
          minHeight: '100%',
          margin: isMobile ? '0 auto' : 'initial', // Centraliza o cartão em mobile
          padding: isMobile ? 1 : 2,  // Menor padding em mobile
        }}
      >
        <CardHeader
          avatar={renderizeAvatar()}
          title={<Typography fontWeight="bold">{title}</Typography>}
          subheader={date.toLocaleDateString()}
        />
        <CardMedia
          onClick={openImage}
          sx={{
            cursor: 'pointer',
            height: isMobile ? '200px' : '250px', // Altura menor em mobile
            objectFit: 'cover',  // Garante que a imagem cubra a área sem distorção
          }}
          component="img"
          src={srcPhotoS3}
        />
        <CardContent
          sx={{
            height: isMobile ? 'auto' : '109px', // Ajusta a altura para mobile
            overflow: 'hidden', // Esconde o excesso de texto se a altura for menor
          }}
        >
          <Typography paragraph style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </CardContent>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="end"
        >
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: isMobile ? 'space-between' : 'end', // Ajusta a justificativa para mobile
              padding: isMobile ? 1 : 2,  // Menor padding em mobile
            }}
            disableSpacing
          >
            <IconButton onClick={handleOpenComments} aria-label="add to favorites">
              <ForumIcon />
            </IconButton>
            {haveDescription && (
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            )}
          </CardActions>
        </Box>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{description}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
}

export default CardPhoto;
