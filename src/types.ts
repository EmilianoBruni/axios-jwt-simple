import { InternalAxiosRequestConfig, AxiosStatic, AxiosResponse } from 'axios';
import AjsSessionStorage from '@/lib/AjsSessionStorage.js';

/**
 * Type definition for Axios request configuration.
 */
export type AjsRequestConfig = InternalAxiosRequestConfig;

/**
 * Type definition for Axios response.
 */
export type AjsResponse = AxiosResponse;

/**
 * Type definition for a function that modifies the request configuration.
 */
export type AjsOnRequest = (
    requestConfig: AjsRequestConfig
) => AjsRequestConfig;

/**
 * Type definition for a function that modifies the response.
 */
export type AjsOnResponse = (response: AjsResponse) => AjsResponse;

/**
 * Interface extending AxiosStatic with JWT-related properties and methods.
 */
export interface AjsStatic extends AxiosStatic {
    /**
     * Initializes the JWT configuration for the Axios instance.
     * @param urlBase - The base URL for the API.
     * @param onLoginRequest - Optional custom handler for login requests.
     * @param onLoginResponse - Optional custom handler for login responses.
     */
    jwtInit: (
        urlBase: string,
        onLoginRequest?: AjsOnRequest,
        onLoginResponse?: AjsOnResponse
    ) => void;

    /**
     * Custom handler for login requests.
     */
    onLoginRequest: AjsOnRequest;

    /**
     * Custom handler for login responses.
     */
    onLoginResponse: AjsOnResponse;

    /**
     * Custom handler for refresh requests.
     */
    onRefreshRequest: AjsOnRequest;

    /**
     * Custom handler for refresh responses.
     */
    onRefreshResponse: AjsOnResponse;

    /**
     * Path for the login endpoint.
     */
    pathLogin: string;

    /**
     * Path for the logout endpoint.
     */
    pathLogout: string;

    /**
     * Path for the token refresh endpoint.
     */
    pathRefresh: string;

    /**
     * Session storage instance for managing tokens.
     */
    sS: AjsSessionStorage;

    /**
     * State of JWT mode, storing interceptor IDs or -1 if not active.
     */
    jwtMode: [number, number];

    /**
     * Enables or disables JWT mode by adding/removing interceptors.
     * @param mode - `true` to enable JWT mode, `false` to disable it.
     */
    setJwtMode: (mode: boolean) => void;
}
