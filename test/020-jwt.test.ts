import tap from 'tap';
import ajs from '@/index.js';
import { AjsRequestConfig, AjsResponse } from '@/types.js';

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

tap.test('Ajs jwtInit with JwtMode disabled. Axios compatibility', async t => {
    t.equal(typeof ajs.jwtInit, 'function', 'Ajs.init should be a function');

    const baseUrl = 'https://mockhttp.org';
    ajs.jwtInit(baseUrl);
    // but force to not load interceptor for jwt
    ajs.setJwtMode(false);
    t.equal(ajs.defaults.baseURL, baseUrl, 'Ajs.init should set the baseURL');

    // test get method with path only
    const path = '/get';
    const response = await ajs.get(path);
    t.ok(response, 'Ajs.get should return a response');
    t.ok(response.status, 'Ajs.get should return a status');
    t.equal(response.status, 200, 'Ajs.get should return a status of 200');
    t.ok(response.statusText, 'Ajs.get should return a statusText');
    t.equal(
        response.statusText,
        'OK',
        'Ajs.get should return a statusText of OK'
    );
    t.equal(typeof response, 'object', 'Ajs.get should return an object');
    t.ok(response.data, 'Ajs.get should return a data property');
    t.equal(typeof response.data, 'object', 'Ajs.get should return an object');
    t.equal(
        response.data.method,
        'GET',
        'Ajs.get should return the correct method'
    );

    t.end();
});

tap.test('Ajs jwtInit with initial conf', async t => {
    t.equal(typeof ajs.jwtInit, 'function', 'Ajs.init should be a function');

    const baseUrl = 'https://mockhttp.org';

    const accessToken = generateFakeJwtToken(1000);
    const refreshToken = generateFakeJwtToken(2000);

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

    t.equal(ajs.defaults.baseURL, baseUrl, 'Ajs.init should set the baseURL');

    // see if in the request we have auth data
    const path = '/headers';
    const response = await ajs.get(path);
    t.ok(response, 'Ajs.get should return a response');
    t.ok(response.status, 'Ajs.get should return a status');
    t.equal(response.status, 200, 'Ajs.get should return a status of 200');
    t.ok(response.data, 'Ajs.get should return a data property');
    t.equal(typeof response.data, 'object', 'Ajs.get should return an object');
    t.equal(
        response.data.headers.authorization,
        'Bearer ' + accessToken,
        'Ajs have the correct authorization header'
    );

    t.end();
});
