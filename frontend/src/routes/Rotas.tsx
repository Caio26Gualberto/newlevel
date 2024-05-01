import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import Login from '../views/loginAndRegister/Login';
import Register from '../views/loginAndRegister/Register';
import Apresentation from '../views/apresentation/Apresentation';
import { AlertProvider } from '../context/AlertContext';

const Rotas = () => {
  return (
    <AlertProvider >
      <Router>
        <Switch>
          <Route path="/" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/welcome" element={<Apresentation/>} />
        </Switch>
      </Router>
    </AlertProvider >
  )
}

export default Rotas;
