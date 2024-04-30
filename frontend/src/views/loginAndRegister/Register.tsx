import { get, post } from "../../services/api/httpService"


const Register = () => {

    const login = async () => {
        try {
            const userLogin = {
                email: "caio.gualberto",
                password: "Franco1004@"
            }
            const result = await post<{ token: string, refreshToken: string }>(`/Authenticate/login`, userLogin)
            window.localStorage.setItem('Authorization', result.token)
            window.localStorage.setItem('RefreshToken', result.refreshToken)
        } catch (error) {

        }
    }

    return (
        <>
            <div>
                <button onClick={login}>Caio Registro</button>
            </div>
            <div>
            </div>
        </>
    )
}

export default Register
