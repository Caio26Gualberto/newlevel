import axios, { AxiosError } from 'axios';
import { redirect } from 'react-router-dom';
import { baseUrlReactLocal } from './axiosApi';

export default class RequestInterceptor {
    static setupInterceptors(): void {
        axios.interceptors.request.use(
            (config) => {
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Intercepta respostas antes de serem processadas
        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            (error: AxiosError) => {
                if (error.response) {
                    const statusCode: number = error.response.status;
                    
                    switch (statusCode) {
                        case 401:
                            return redirect(`${baseUrlReactLocal}/login`)
                        case 403:
                            return redirect(`${baseUrlReactLocal}/login`)
                        default:
                            break;
                    }
                }
                return Promise.reject(error);
            }
        );
    }
}
