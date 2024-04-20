import { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

export function authInterceptor(config: InternalAxiosRequestConfig<any>) {
    const authData = window.localStorage.getItem('Token')

    if (config.headers) {
        config.headers.Authorization = 'Bearer ' + authData
    }
    return config
}