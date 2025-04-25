import { AjsRequestConfig, AjsResponse, AjsStatic } from '@/types.js';

/**
 * Intercepts outgoing requests to handle JWT tokens.
 * Adds authorization headers or refreshes tokens as needed.
 *
 * @param ajs - The Axios instance with JWT support.
 * @param config - The Axios request configuration.
 * @returns The modified request configuration.
 */
const interceptJwtRequest = async (
    ajs: AjsStatic,
    config: AjsRequestConfig
) => {
    try {
        // If the request is for the login endpoint, call the onLoginRequest callback
        if (config.url === ajs.pathLogin) {
            let lconfig = config;
            lconfig = ajs.onLoginRequest(lconfig); // Modify the login request
            return lconfig;
        }

        const sRT = ajs.sS.getRefreshToken(); // Retrieve the refresh token

        // If the request is for the refresh endpoint and the refresh token is valid
        if (config.url === ajs.pathRefresh && ajs.sS.isRefreshTokenValid()) {
            // Add the refresh token as a Bearer token in the Authorization header
            config.headers['Authorization'] = `Bearer ${sRT.v}`;
            let lconfig = config;
            lconfig = ajs.onRefreshRequest(lconfig); // Modify the refresh request
            return lconfig;
        }

        // If the refresh token is not valid, attempt to log in
        if (!ajs.sS.isRefreshTokenValid()) {
            console.warn(
                '🟡 Refresh token expired or does not exist. Try to refresh'
            );
            await login(ajs);
        }

        // If the refresh token is still not valid after login
        if (!ajs.sS.isRefreshTokenValid()) {
            console.error(
                '🟥 Refresh token invalid after login. This is a problem.'
            );
            throw new Error(
                'Refresh token invalid after login. This is a problem.'
            );
        }

        // If the access token is not valid, attempt to refresh it
        if (!ajs.sS.isAccessTokenValid()) {
            console.warn('🟡 Access token expired. Try to refresh');
            await refresh(ajs);
        }

        // If the access token is still not valid after refresh
        if (!ajs.sS.isAccessTokenValid()) {
            console.error(
                '🟥 Access token invalid after renew. This is a problem.'
            );
            throw new Error(
                'Access token invalid after renew. This is a problem.'
            );
        }

        // If the access token is valid, add it as a Bearer token in the Authorization header
        const sAT = ajs.sS.getAccessToken();
        config.headers['Authorization'] = `Bearer ${sAT.v}`;

        return config;
    } catch (error) {
        console.error('Error in interceptJwtRequest:', error);
        throw error;
    }
};

/**
 * Logs in using the login endpoint and updates the access and refresh tokens.
 *
 * @param ajs - The Axios instance with JWT support.
 */
const login = async (ajs: AjsStatic) => {
    try {
        const response = await ajs.post(ajs.pathLogin);
        if (response.status === 200 && response.data && response.data.token) {
            // Update the access and refresh tokens
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

/**
 * Refreshes the access token using the refresh endpoint.
 *
 * @param ajs - The Axios instance with JWT support.
 */
const refresh = async (ajs: AjsStatic) => {
    try {
        const response = await ajs.get(ajs.pathRefresh);
        if (response.status === 200 && response.data && response.data.token) {
            // Update the access token
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

/**
 * Intercepts incoming responses to handle JWT tokens.
 * Calls appropriate callbacks for login and refresh responses.
 *
 * @param ajs - The Axios instance with JWT support.
 * @param response - The Axios response object.
 * @returns The modified response object.
 */
const interceptJwtResponse = async (ajs: AjsStatic, response: AjsResponse) => {
    // If the response is for the login endpoint, call the onLoginResponse callback
    if (response.config.url === ajs.pathLogin) {
        const lresponse = ajs.onLoginResponse(response);
        return lresponse;
    }

    // If the response is for the refresh endpoint, call the onRefreshResponse callback
    if (response.config.url === ajs.pathRefresh) {
        const lresponse = ajs.onRefreshResponse(response);
        return lresponse;
    }

    return response; // Return the unmodified response for other endpoints
};

export { interceptJwtRequest, interceptJwtResponse };
