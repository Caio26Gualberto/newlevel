import axios from "axios"



const Login = () => {

  const login = async () => {
    debugger
    const userLogin = {
      email: "caio.gualberto",
      password: "Franco1004@"
    }
    const result = await axios.post("https://localhost:7258/newLevel/Authenticate/login", userLogin)
    window.localStorage.setItem('Authorization', result.data.token)
  }

  return (
    <>
      <button onClick={login}>CAIO</button>
    </>
  )
}

export default Login
