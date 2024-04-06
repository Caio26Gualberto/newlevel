import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { redirect } from 'react-router-dom';

export class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string) {
        if (baseUrl === '') throw new Error('Base URL is empty');
        this.baseUrl = baseUrl;
        // this.authObject = authObject;
        this.token = window.localStorage.getItem('Authorization')
    }

    private async refreshToken() {
        try {
            const response = await axios.get(`${this.baseUrl}/Authenticate/RenewToken?accessToken=${this.token}`);
            this.token = response.data.token;
        } catch (error: any) {
            const statusCodeToRefreshToken = [401, 403];
                if (error.response && statusCodeToRefreshToken.includes(error.response.status)) {
                    // Redirecionar para a página de login
                    window.location.href = `${baseUrlReactLocal}/login`
                    return
                } else {
                    // Tratar outros erros aqui
                    throw error;
                }
        }
    }

    private async request<T>(
        method: string,
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const headers: any = {
            'Content-Type': 'application/json',
        };

        debugger

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const axiosConfig: AxiosRequestConfig = {
            method,
            url: `${this.baseUrl}${url}`,
            data,
            headers,
            ...config,
        };

        try {
            const response: AxiosResponse<T> = await axios(axiosConfig);
            return response.data;
        } catch (error: any) {
            const statusCodeToRefreshToken = [401, 403]
            if (error.response && statusCodeToRefreshToken.includes(error.response.status)) {
                // Token expirado, tentar renovar o token
                await this.refreshToken();
                // Tentar a chamada novamente com o novo token
                const responseOnError = await this.request<T>(method, url, data, config);
                return responseOnError;
            } else {
                // Tratar outros erros aqui
                throw error;
            }
        }
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return await this.request<T>('post', url, data, config);
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return await this.request<T>('get', url, undefined, config);
    }
}

export const baseUrlApiLocal = "https://localhost:7258/api"
export const baseUrlReactLocal = "http://localhost:3000"
export const baseUrlProd = ""