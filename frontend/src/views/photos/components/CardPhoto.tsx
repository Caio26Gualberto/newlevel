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

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

interface CardPhotoProps {
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

const CardPhoto: React.FC<CardPhotoProps> = ({ title, srcPhotoS3, srcUserPhotoProfile, date, subtitle, description, userId, nickname }) => {
  const haveDescription = description ? true : false;
  const [expanded, setExpanded] = React.useState(false);
  const [openAvatar, setOpenAvatar] = React.useState(false);

  const handleClickOpenAvatar = () => {
    setOpenAvatar(true);
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
      return <Avatar  src={srcUserPhotoProfile} onClick={handleClickOpenAvatar} sx={{ cursor: "pointer" }} aria-label="recipe">
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
      <PictureProfileModal onClose={handleCloseAvatar} open={openAvatar} avatarUrl={srcUserPhotoProfile!} nickname={nickname!}/>
      <Card sx={{ maxWidth: 345, minHeight: "100%" }}>
        <CardHeader
          avatar={
            renderizeAvatar()
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={<Typography fontWeight="bold">{title}</Typography>}
          subheader={date.toLocaleDateString()}
        />
        <CardMedia
          onClick={openImage}
          sx={{ cursor: "pointer" }}
          component="img"
          height="250"
          src={srcPhotoS3}
        />
        <CardContent sx={{ height: "109px" }}>
          <Typography paragraph style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </CardContent>
        <Box display="flex" flexDirection="column" justifyContent="end">
          <CardActions sx={{ display: "flex", justifyContent: "end" }} disableSpacing>
            <IconButton aria-label="add to favorites">
              <ForumIcon />
            </IconButton>
            {haveDescription && <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>}
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
