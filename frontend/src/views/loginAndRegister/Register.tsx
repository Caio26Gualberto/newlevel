import axios from 'axios'
import { baseUrlApiLocal } from '../../services/axiosApi'
import RequestInterceptor from '../../services/axiosInterceptors';

RequestInterceptor.setupInterceptors();

const Register = () => {

    const login = async () => {
        try {
            debugger
            
            // const result = await axios.post(`${baseUrlApiLocal}/newLevel/Authenticate/login`, userLogin)
            // window.localStorage.setItem('Authorization', result.data.token)
            // window.localStorage.setItem('RefreshToken', result.data.refreshToken)
        } catch (error) {

        }
    }

    return (
        <div>
            <button onClick={login}>Caio Registro</button>
        </div>
    )
}

export default Register
