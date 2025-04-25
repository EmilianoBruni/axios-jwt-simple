import tap from 'tap';
import ajs from '@/index.js';

tap.test('Ajs jwtInit', async t => {
    t.equal(typeof ajs.jwtInit, 'function', 'Ajs.init should be a function');

    const baseUrl = 'https://mockhttp.org';
    ajs.jwtInit(baseUrl);
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
