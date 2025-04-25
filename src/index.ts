import axios from 'axios';
import interceptErrors from '@/lib/interceptErrors.js';
import type {
    AjsOnLoginRequest,
    AjsOnLoginResponse,
    AjsRequestConfig,
    AjsResponse,
    AjsStatic
} from '@/types.js';
import AjsSessionStorage from '@/lib/AjsSessionStorage.js';
import {
    interceptJwtRequest,
    interceptJwtResponse
} from '@/lib/interceptJwtSession.js';

const ajs = axios as AjsStatic;

// defaults
ajs.pathLogin = '/auth/token';
ajs.pathLogout = '/auth/logout';
ajs.pathRefresh = '/auth/refresh';
ajs.onLoginRequest = (requestConfig: AjsRequestConfig) => requestConfig;
ajs.onLoginResponse = (response: AjsResponse) => response;
ajs.sessionStorage = new AjsSessionStorage();
ajs.jwtMode = [-1, -1];

ajs.jwtInit = function (
    urlBase: string,
    onLoginRequest?: AjsOnLoginRequest,
    onLoginResponse?: AjsOnLoginResponse
) {
    ajs.defaults.baseURL = urlBase;
    ajs.setJwtMode(true);

    if (onLoginRequest) ajs.onLoginRequest = onLoginRequest;
    if (onLoginResponse) ajs.onLoginResponse = onLoginResponse;
};

ajs.interceptors.response.use(
    response => {
        // console.log('Ajs response interceptor', response);
        return response;
    },
    error => {
        // console.log('Ajs error interceptor', error);
        return interceptErrors(error);
    }
);

ajs.setJwtMode = (mode: boolean) => {
    if (mode && ajs.jwtMode[0] === -1) {
        ajs.jwtMode[0] = ajs.interceptors.request.use(
            request => interceptJwtRequest(ajs, request),
            error => error
        );
        ajs.jwtMode[1] = ajs.interceptors.response.use(
            response => interceptJwtResponse(ajs, response),
            error => error
        );
    } else if (!mode && ajs.jwtMode[0] !== -1) {
        ajs.interceptors.request.eject(ajs.jwtMode[0]);
        ajs.interceptors.response.eject(ajs.jwtMode[1]);
        ajs.jwtMode = [-1, -1];
    }
};

export default ajs as AjsStatic;
