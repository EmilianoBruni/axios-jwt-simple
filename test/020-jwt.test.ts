import tap from 'tap';
import ajs from '@/index.js';
import { AjsRequestConfig, AjsResponse } from '@/types.js';
import { generateFakeJwtToken, checkBearer, fakeJwtAjs } from './utils.js';

/**
 * Test case for initializing JWT with JWT mode disabled.
 * Ensures Axios compatibility.
 */
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
});

/**
 * Test case for initializing JWT with initial configuration.
 */
tap.test('Ajs jwtInit with initial conf', async t => {
    const accessToken = generateFakeJwtToken(1000);
    const refreshToken = generateFakeJwtToken(2000);

    fakeJwtAjs(ajs, accessToken, refreshToken);
    t.equal(typeof ajs.jwtInit, 'function', 'Ajs.init should be a function');

    await checkBearer(t, ajs, accessToken);
});

/**
 * Test case for initializing JWT with refresh token.
 */
tap.test('Ajs jwtInit with refresh token', async t => {
    const accessToken = generateFakeJwtToken(12);
    const anotherAccessToken = generateFakeJwtToken(1000);
    const refreshToken = generateFakeJwtToken(2000);

    const onRefreshRequest = (requestConfig: AjsRequestConfig) => {
        requestConfig.params = {
            token: anotherAccessToken
        };
        return requestConfig;
    };

    const onRefreshResponse = (response: AjsResponse) => {
        response.data = { ...response.data.queryParams };
        return response;
    };

    fakeJwtAjs(ajs, accessToken, refreshToken);

    ajs.onRefreshRequest = onRefreshRequest;
    ajs.onRefreshResponse = onRefreshResponse;

    await checkBearer(t, ajs, accessToken);

    // wait for the token to expire
    await new Promise(resolve => setTimeout(resolve, 3000));

    await checkBearer(t, ajs, anotherAccessToken);
});

/**
 * Test case for initializing JWT when tokens are expired.
 */
tap.test('Ajs jwtInit when tokens expired', async t => {
    const accessToken = generateFakeJwtToken(12);
    const anotherAccessToken = generateFakeJwtToken(1000);
    const refreshToken = generateFakeJwtToken(12);
    const anotherRefreshToken = generateFakeJwtToken(2000);

    fakeJwtAjs(ajs, accessToken, refreshToken);
    await checkBearer(t, ajs, accessToken);

    // wait for the token to expire
    await new Promise(resolve => setTimeout(resolve, 3000));

    // set a new onLoginRequest to inject the new tokens
    ajs.onLoginRequest = (requestConfig: AjsRequestConfig) => {
        requestConfig.data = {
            token: anotherAccessToken,
            refreshToken: anotherRefreshToken
        };
        return requestConfig;
    };

    await checkBearer(t, ajs, anotherAccessToken);
});
