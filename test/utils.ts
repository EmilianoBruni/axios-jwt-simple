import { AjsStatic, AjsRequestConfig, AjsResponse } from '@/types.js';
import type { Test } from 'tap';

// configure a ajs instance to work with mockhttp
const fakeJwtAjs = (
    ajs: AjsStatic,
    accessToken: string,
    refreshToken: string
) => {
    const baseUrl = 'https://mockhttp.org';

    // inject tokens to the request so we find them in the response
    const onLoginRequest = (requestConfig: AjsRequestConfig) => {
        requestConfig.data = {
            token: accessToken,
            refreshToken: refreshToken
        };
        return requestConfig;
    };
    // move mock body response to data where ajs expects it
    const onLoginResponse = (response: AjsResponse) => {
        response.data = { ...response.data.body };
        return response;
    };

    ajs.jwtInit(baseUrl, onLoginRequest, onLoginResponse);

    // change default values for the test
    ajs.pathLogin = '/post';
    ajs.pathRefresh = '/get';
};

/**
 * Generates a fake JWT token for testing purposes.
 * @param exp - The expiration time in seconds.
 * @returns A fake JWT token string.
 */
const generateFakeJwtToken = (exp: number) => {
    const header = {
        alg: 'none',
        typ: 'JWT'
    };
    const payload = {
        exp: Math.floor(Date.now() / 1000) + exp,
        iat: Math.floor(Date.now() / 1000),
        sub: '1234567890',
        name: 'John Doe'
    };

    const base64UrlHeader = Buffer.from(JSON.stringify(header)).toString(
        'base64url'
    );
    const base64UrlPayload = Buffer.from(JSON.stringify(payload)).toString(
        'base64url'
    );
    const signature = 'signature'; // No signature for this test
    return `${base64UrlHeader}.${base64UrlPayload}.${signature}`;
};

const checkBearer = async (t: Test, ajs: AjsStatic, token: string) => {
    const path = '/headers';
    const response = await ajs.get(path);
    t.ok(response, 'Ajs.get should return a response');
    t.ok(response.status, 'Ajs.get should return a status');
    t.equal(response.status, 200, 'Ajs.get should return a status of 200');
    t.ok(response.data, 'Ajs.get should return a data property');
    t.equal(typeof response.data, 'object', 'Ajs.get should return an object');
    t.equal(
        response.data.headers.authorization,
        'Bearer ' + token,
        'Ajs have the correct authorization header'
    );
};

export { fakeJwtAjs, generateFakeJwtToken, checkBearer };
