import axios from 'axios';
import interceptErrors from '@/lib/interceptErrors.js';
import type { AjsOnLogin, AjsRequestConfig, AjsStatic } from '@/types.js';
import AjsSessionStorage from '@/lib/AjsSessionStorage.js';

const ajs = axios as AjsStatic;

// defaults
ajs.pathLogin = '/auth/token';
ajs.pathLogout = '/auth/logout';
ajs.pathRefresh = '/auth/refresh';
ajs.onLogin = (requestConfig: AjsRequestConfig) => requestConfig;
ajs.sessionStorage = new AjsSessionStorage();

ajs.jwtInit = function (urlBase: string, onLogin?: AjsOnLogin) {
    ajs.defaults.baseURL = urlBase;

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

export default ajs as AjsStatic;
