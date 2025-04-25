import axios from 'axios';
import interceptErrors from '@/lib/interceptErrors.js';
import type {
    AjsOnRequest,
    AjsOnResponse,
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

// Default paths for authentication-related endpoints
ajs.pathLogin = '/auth/token'; // Endpoint for login
ajs.pathLogout = '/auth/logout'; // Endpoint for logout
ajs.pathRefresh = '/auth/refresh'; // Endpoint for token refresh

// Default handlers for login and refresh requests/responses
ajs.onLoginRequest = (requestConfig: AjsRequestConfig) => requestConfig; // Modify login request
ajs.onLoginResponse = (response: AjsResponse) => response; // Handle login response
ajs.onRefreshRequest = (requestConfig: AjsRequestConfig) => requestConfig; // Modify refresh request
ajs.onRefreshResponse = (response: AjsResponse) => response; // Handle refresh response

// JWT mode state: stores interceptor IDs or -1 if not active
ajs.jwtMode = [-1, -1];

/**
 * Initializes the JWT configuration for the Axios instance.
 * @param urlBase - The base URL for the API.
 * @param onLoginRequest - Optional custom handler for login requests.
 * @param onLoginResponse - Optional custom handler for login responses.
 */
ajs.jwtInit = function (
    urlBase: string,
    onLoginRequest?: AjsOnRequest,
    onLoginResponse?: AjsOnResponse
) {
    ajs.defaults.baseURL = urlBase; // Set the base URL for all requests
    ajs.sS = new AjsSessionStorage(); // Initialize session storage
    ajs.setJwtMode(true); // Enable JWT mode by default

    // Set custom handlers if provided
    if (onLoginRequest) ajs.onLoginRequest = onLoginRequest;
    if (onLoginResponse) ajs.onLoginResponse = onLoginResponse;
};

// Global response interceptor for handling errors
ajs.interceptors.response.use(
    response => {
        // Pass through successful responses
        return response;
    },
    error => {
        // Handle errors using the custom error interceptor
        return interceptErrors(error);
    }
);

/**
 * Enables or disables JWT mode by adding/removing interceptors.
 * @param mode - `true` to enable JWT mode, `false` to disable it.
 */
ajs.setJwtMode = (mode: boolean) => {
    if (mode && ajs.jwtMode[0] === -1) {
        // Enable JWT mode: add request and response interceptors
        ajs.jwtMode[0] = ajs.interceptors.request.use(
            request => interceptJwtRequest(ajs, request), // Handle JWT in requests
            error => error
        );
        ajs.jwtMode[1] = ajs.interceptors.response.use(
            response => interceptJwtResponse(ajs, response), // Handle JWT in responses
            error => error
        );
    } else if (!mode && ajs.jwtMode[0] !== -1) {
        // Disable JWT mode: remove interceptors
        ajs.interceptors.request.eject(ajs.jwtMode[0]);
        ajs.interceptors.response.eject(ajs.jwtMode[1]);
        ajs.jwtMode = [-1, -1]; // Reset JWT mode state
    }
};

export default ajs as AjsStatic;
