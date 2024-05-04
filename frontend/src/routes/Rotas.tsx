import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import Login from '../views/loginAndRegister/Login';
import Register from '../views/loginAndRegister/Register';
import Apresentation from '../views/apresentation/Apresentation';
import Videos from '../views/videos/Videos';

const Rotas = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<Apresentation />} />
        <Route path="/videos" element={<Videos />} />
      </Switch>
    </Router>
  )
}

export default Rotas;
