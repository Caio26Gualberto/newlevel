import axios, { AxiosInstance, AxiosResponse } from 'axios';
import axiosService from './axiosService';

// Definindo tipos para os parâmetros das requisições
interface Params {
    [key: string]: any;
}

interface Data {
    [key: string]: any;
}

// Método genérico para requisições GET
export const get = async <T>(url: string, params?: Params): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axiosService.get(url, { params });
        return response.data;
    } catch (error) {
        // Tratar erros, se necessário
        throw error;
    }
};

// Método genérico para requisições PUT
export const put = async <T>(url: string, data: Data): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axiosService.put(url, data);
        return response.data;
    } catch (error) {
        // Tratar erros, se necessário
        throw error;
    }
};

// Método genérico para requisições DELETE
export const remove = async <T>(url: string): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axiosService.delete(url);
        return response.data;
    } catch (error) {
        // Tratar erros, se necessário
        throw error;
    }
};

// Método genérico para requisições POST
export const post = async <T>(url: string, data: Data): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axiosService.post(url, data);
        return response.data;
    } catch (error) {
        // Tratar erros, se necessário
        throw error;
    }
};
