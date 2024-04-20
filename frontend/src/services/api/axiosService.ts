import axios from "axios";
import { authInterceptor } from "./axiosInterceptor";

const axiosService = axios.create({ baseURL: 'https://localhost:7258' })

axiosService.interceptors.request.use(authInterceptor)

export default axiosService