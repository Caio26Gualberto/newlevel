import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import Login from '../views/loginAndRegister/Login';

const Rotas = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" element={<Login/>} />
      </Switch>
    </Router>
  )
}

export default Rotas
