import { useState } from "react";
import ApiConfiguration from "../../apiConfig"
import { AuthenticateApi } from "../../gen/api/src"

interface IFormRegister {
    email: string,
    password: string,
    birthPlace: string,
}

const Register = () => {
    const api = new AuthenticateApi(ApiConfiguration)
    const [formRegister, setFormRegister] = useState<IFormRegister>({
        email: '',
        password: '',
        birthPlace: ''
    });

    const login = async () => {
        try {
            const result = await api.apiAuthenticateRegisterPost({
                loginAndRegisterInputDto: {
                    email: formRegister.email,
                    password: formRegister.password
                }
            })
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
