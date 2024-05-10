import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import Login from '../views/loginAndRegister/Login';
import Register from '../views/loginAndRegister/Register';
import Apresentation from '../views/apresentation/Apresentation';
import Videos from '../views/videos/Videos';
import Navbar from '../components/layouts/Navbar';
import Photos from '../views/photos/Photos';
import Podcast from '../views/podcast/Podcast';
import AboutMe from '../views/aboutMe/AboutMe';
import MyVideos from '../views/myVideos/MyVideos';

const Rotas = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<Apresentation />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/podcasts" element={<Podcast />} />
        <Route path="/aboutMe" element={<AboutMe />} />
        <Route path="/myVideos" element={<MyVideos />} />
      </Switch>
    </Router>
  )
}

export default Rotas;
