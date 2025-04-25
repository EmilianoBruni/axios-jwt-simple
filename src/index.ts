import axios from 'axios';
import interceptErrors from '@/lib/interceptErrors.js';
import type { AjsOnLogin, AjsRequestConfig, AjsStatic } from '@/types.js';
import AjsSessionStorage from '@/lib/AjsSessionStorage.js';
import interceptJwtSession from '@/lib/interceptJwtSession.js';

const ajs = axios as AjsStatic;

// defaults
ajs.pathLogin = '/auth/token';
ajs.pathLogout = '/auth/logout';
ajs.pathRefresh = '/auth/refresh';
ajs.onLogin = (requestConfig: AjsRequestConfig) => requestConfig;
ajs.sessionStorage = new AjsSessionStorage();
ajs.jwtMode = -1;

ajs.jwtInit = function (urlBase: string, onLogin?: AjsOnLogin) {
    ajs.defaults.baseURL = urlBase;
    ajs.setJwtMode(true);

    if (onLogin) {
        ajs.onLogin = onLogin;
    }
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
    if (mode && ajs.jwtMode === 0) {
        ajs.jwtMode = ajs.interceptors.request.use(
            request => interceptJwtSession(ajs, request),
            error => error
        );
    } else if (!mode && ajs.jwtMode !== -1) {
        ajs.interceptors.request.eject(ajs.jwtMode);
    }
};

export default ajs as AjsStatic;
