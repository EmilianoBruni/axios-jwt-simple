import { AjsRequestConfig, AjsStatic } from '@/types.js';
import AjsSessionStorage from '@/lib/AjsSessionStorage.js';

const sS = new AjsSessionStorage();

export default async (ajs: AjsStatic, config: AjsRequestConfig) => {
    console.log('Loading interceptJwtSession');

    // if url is pathLogin call onLogin callback
    // to add custom headers or params to login request. Usually
    // config.data = { username, password }
    if (config.url === ajs.pathLogin) {
        let lconfig = config;
        console.log('🟢 Login request. Calling on Login');
        if (ajs.onLogin) lconfig = ajs.onLogin(lconfig);
        return lconfig;
    }

    const sRT = sS.getRefreshToken();

    if (config.url === ajs.pathRefresh && sRT.v) {
        // add bearer token to get new access token
        config.headers['Authorization'] = `Bearer ${sRT.v}`;
    }

    // check is refresh token is not valid
    if (!sS.isRefreshTokenValid()) {
        console.warn(
            '🟡 Refresh token expired or does not exist. Try to refresh'
        );
        await login(ajs);
    }

    // check is access token is not valid
    if (!sS.isAccessTokenValid()) {
        console.warn('🟡 Access token expired. Try to refresh');
        await refresh(ajs);
    }

    // if access token is valid, add bearer token to request
    const sAT = sS.getAccessToken();
    config.headers['Authorization'] = `Bearer ${sAT.v}`;

    return config;
};

const login = async (ajs: AjsStatic) => {
    try {
        const response = await ajs.post(ajs.pathLogin);
        if (response.status === 200 && response.data && response.data.token) {
            // update access token
            sS.setAccessToken(response.data.token);
            sS.setRefreshToken(response.data.refreshToken);
        } else {
            console.error('🟥 Login failed. No token in response');
            throw new Error('Login failed. No token in response');
        }
    } catch (error) {
        console.error(
            '🟥 Error while logging in: %s',
            error instanceof Error ? error.message : error
        );
        throw new Error('Error while logging in');
    }
};

const refresh = async (ajs: AjsStatic) => {
    try {
        const response = await ajs.get(ajs.pathRefresh);
        if (response.status === 200 && response.data && response.data.token) {
            // update access token
            sS.setAccessToken(response.data.token);
        } else {
            console.error('🟥 Refresh token failed. No token in response');
            throw new Error('Refresh token failed. No token in response');
        }
    } catch (error) {
        console.error(
            '🟥 Error while refreshing access token: %s',
            error instanceof Error ? error.message : error
        );
        throw new Error('Error while refreshing access token');
    }
};
