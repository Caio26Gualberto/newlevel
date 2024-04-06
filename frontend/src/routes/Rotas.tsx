import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import Login from '../views/loginAndRegister/Login';
import Register from '../views/loginAndRegister/Register';

const Rotas = () => {
  
  return (
    <Router>
      <Switch>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Switch>
    </Router>
  )
}

export default Rotas
