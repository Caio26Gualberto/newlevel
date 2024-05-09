import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import Login from '../views/loginAndRegister/Login';
import Register from '../views/loginAndRegister/Register';
import Apresentation from '../views/apresentation/Apresentation';
import Videos from '../views/videos/Videos';
import Navbar from '../components/layouts/Navbar';
import Photos from '../views/photos/Photos';

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
      </Switch>
    </Router>
  )
}

export default Rotas;
