import { InternalAxiosRequestConfig, AxiosStatic } from 'axios';
import AjsSessionStorage from '@/lib/AjsSessionStorage.js';

export type AjsRequestConfig = InternalAxiosRequestConfig;

export type AjsOnLogin = (requestConfig: AjsRequestConfig) => AjsRequestConfig;

export interface AjsStatic extends AxiosStatic {
    jwtInit: (urlBase: string) => void;
    onLogin?: AjsOnLogin;
    pathLogin: string;
    pathLogout: string;
    pathRefresh: string;
    sessionStorage: AjsSessionStorage;
    jwtMode: number;
    setJwtMode: (mode: boolean) => void;
}
