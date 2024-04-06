import axios from 'axios'
import { ApiClient, baseUrlApiLocal } from '../../services/axiosApi'

const Register = () => {
    const axiosInstance = new ApiClient(baseUrlApiLocal)

    const login = async () => {
        try {
            debugger
            
            const result = await axiosInstance.post<{ token: string, refreshToken: string }>(`/Authenticate/login`, userLogin)
            window.localStorage.setItem('Authorization', result.token)
            window.localStorage.setItem('RefreshToken', result.refreshToken)
        } catch (error) {

        }
    }

    const logout = async () => {
        try {
            debugger
            const userLogin = {
                email: "caio.gualberto",
                password: "Franco1004@"
            }
            const result = await axiosInstance.get<{ token: string, refreshToken: string }>(`/Authenticate/logout`)
        } catch (error) {

        }
    }

    return (
        <>
            <div>
                <button onClick={login}>Caio Registro</button>
            </div>
            <div>
                <button onClick={logout}>Caio Logout</button>
            </div>
        </>
    )
}

export default Register
