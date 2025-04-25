import { AjsRequestConfig, AjsResponse, AjsStatic } from '@/types.js';

const interceptJwtRequest = async (
    ajs: AjsStatic,
    config: AjsRequestConfig
) => {
    // if url is pathLogin call onLogin callback
    // to add custom headers or params to login request. Usually
    // config.data = { username, password }
    if (config.url === ajs.pathLogin) {
        let lconfig = config;
        // console.log('🟢 Login request. Calling on Login');
        lconfig = ajs.onLoginRequest(lconfig);
        return lconfig;
    }

    const sRT = ajs.sS.getRefreshToken();

    if (config.url === ajs.pathRefresh && ajs.sS.isRefreshTokenValid()) {
        // add bearer token to get new access token
        config.headers['Authorization'] = `Bearer ${sRT.v}`;
        let lconfig = config;
        lconfig = ajs.onRefreshRequest(lconfig);
        return lconfig;
    }

    // check is refresh token is not valid
    if (!ajs.sS.isRefreshTokenValid()) {
        console.warn(
            '🟡 Refresh token expired or does not exist. Try to refresh'
        );
        await login(ajs);
    }

    // check is refresh token is still not valid
    if (!ajs.sS.isRefreshTokenValid()) {
        console.error(
            '🟥 Refresh token invalid after login. This is a problem.'
        );
        throw new Error(
            'Refresh token invalid after login. This is a problem.'
        );
    }

    // check is access token is not valid
    if (!ajs.sS.isAccessTokenValid()) {
        console.warn('🟡 Access token expired. Try to refresh');
        await refresh(ajs);
    }

    // check is access token is still not valid
    if (!ajs.sS.isAccessTokenValid()) {
        console.error(
            '🟥 Access token invalid after renew. This is a problem.'
        );
        throw new Error('Access token invalid after renew. This is a problem.');
    }

    // if access token is valid, add bearer token to request
    const sAT = ajs.sS.getAccessToken();
    config.headers['Authorization'] = `Bearer ${sAT.v}`;

    return config;
};

const login = async (ajs: AjsStatic) => {
    try {
        const response = await ajs.post(ajs.pathLogin);
        if (response.status === 200 && response.data && response.data.token) {
            // update access token
            ajs.sS.setAccessToken(response.data.token);
            ajs.sS.setRefreshToken(response.data.refreshToken);
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
            ajs.sS.setAccessToken(response.data.token);
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

const interceptJwtResponse = async (ajs: AjsStatic, response: AjsResponse) => {
    // format response to ajs format so the body payload is
    // {token: '...', refreshToken: '...'}
    // console.log('Loading interceptJwtSession response');

    if (response.config.url === ajs.pathLogin) {
        // console.log('🟢 Login response. Calling on Login');
        const lresponse = ajs.onLoginResponse(response);
        return lresponse;
    }

    if (response.config.url === ajs.pathRefresh) {
        // console.log('🟢 Refresh response. Calling on Refresh');
        const lresponse = ajs.onRefreshResponse(response);
        return lresponse;
    }

    return response;
};

export { interceptJwtRequest, interceptJwtResponse };
