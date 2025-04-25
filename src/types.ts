import { InternalAxiosRequestConfig, AxiosStatic, AxiosResponse } from 'axios';
import AjsSessionStorage from '@/lib/AjsSessionStorage.js';

export type AjsRequestConfig = InternalAxiosRequestConfig;
export type AjsResponse = AxiosResponse;

export type AjsOnLoginRequest = (
    requestConfig: AjsRequestConfig
) => AjsRequestConfig;
export type AjsOnLoginResponse = (response: AjsResponse) => AjsResponse;

export interface AjsStatic extends AxiosStatic {
    jwtInit: (
        urlBase: string,
        onLoginRequest?: AjsOnLoginRequest,
        onLoginResponse?: AjsOnLoginResponse
    ) => void;
    onLoginRequest: AjsOnLoginRequest;
    onLoginResponse: AjsOnLoginResponse;
    pathLogin: string;
    pathLogout: string;
    pathRefresh: string;
    sessionStorage: AjsSessionStorage;
    jwtMode: [number, number];
    setJwtMode: (mode: boolean) => void;
}
