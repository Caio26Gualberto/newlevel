import axios from "axios"
import { baseUrlApiLocal } from "../../services/axiosApi"



const Login = () => {

  const login = async () => {
    try {
      debugger
      
      const result = await axios.post(`${baseUrlApiLocal}/Authenticate/login`, userLogin)
      window.localStorage.setItem('Authorization', result.data.token)
      window.localStorage.setItem('RefreshToken', result.data.refreshToken)
    } catch (error) {

    }
  }

  return (
    <>
      <button onClick={login}>CAIO</button>
    </>
  )
}

export default Login
