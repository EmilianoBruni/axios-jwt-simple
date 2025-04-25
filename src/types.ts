import { InternalAxiosRequestConfig, AxiosStatic, AxiosResponse } from 'axios';
import AjsSessionStorage from '@/lib/AjsSessionStorage.js';

export type AjsRequestConfig = InternalAxiosRequestConfig;
export type AjsResponse = AxiosResponse;

export type AjsOnRequest = (
    requestConfig: AjsRequestConfig
) => AjsRequestConfig;
export type AjsOnResponse = (response: AjsResponse) => AjsResponse;

export interface AjsStatic extends AxiosStatic {
    jwtInit: (
        urlBase: string,
        onLoginRequest?: AjsOnRequest,
        onLoginResponse?: AjsOnResponse
    ) => void;
    onLoginRequest: AjsOnRequest;
    onLoginResponse: AjsOnResponse;
    onRefreshRequest: AjsOnRequest;
    onRefreshResponse: AjsOnResponse;
    pathLogin: string;
    pathLogout: string;
    pathRefresh: string;
    sessionStorage: AjsSessionStorage;
    jwtMode: [number, number];
    setJwtMode: (mode: boolean) => void;
}
