import { Box, Grid } from "@mui/material"
import Media from "./components/Media";

const data = [
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    views: '396k views',
    createdAt: 'a week ago',
  },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    views: '40M views',
    createdAt: '3 years ago',
  },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    createdAt: '10 months ago',
  },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    createdAt: '10 months ago',
  },
  {
    src: 'https://www.youtube.com/embed/HNybmS3xNAQ',
    title: 'Valorant',
    createdAt: '10 months ago',
  },
  // {
  //   src: 'https://www.youtube.com/embed/q2I0ulTZWXA',
  //   title: 'Scream Aim Fire (Official Video)',
  //   createdAt: '10 months ago',
  // },
  // {
  //   src: 'https://www.youtube.com/embed/q2I0ulTZWXA',
  //   title: 'Scream Aim Fire (Official Video)',   
  //   createdAt: '10 months ago',
  // },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    createdAt: '10 months ago',
  },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    createdAt: '10 months ago',
  },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    createdAt: '10 months ago',
  },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    createdAt: '10 months ago',
  },
  {
    src: 'https://www.youtube.com/embed/gqI-6xag8Mg',
    title: 'Scream Aim Fire (Official Video)',
    createdAt: '10 months ago',
  },
];

const Videos = () => {
  return (
    <Box height="100%" bgcolor="#F3F3F3">
      <Grid container pl={3.4}>
        {data.map((item, index) => (
          <Media key={index} src={item.src} title={item.title} createdAt={item.createdAt} />
        ))}
      </Grid>

    </Box>
  )
}

export default Videos
