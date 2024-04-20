import { get, post } from "../../services/api/httpService"


const Register = () => {

    const login = async () => {
        try {
            debugger
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

    const logout = async () => {
        try {
            debugger
            const userLogin = {
                email: "",
                password: ""
            }
            const result = await get<{ token: string, refreshToken: string }>(`/Authenticate/logout`)
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
