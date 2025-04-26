import tap from 'tap';
import ajs from '@/index.js';
import { AjsErrorResponse } from '@/types.js';

tap.test('Ajs instance', async t => {
    t.ok(ajs, 'Ajs instance should be created');
    t.equal(typeof ajs, 'function', 'Ajs should be an object');
    t.equal(typeof ajs.get, 'function', 'Ajs.get should be a function');
});

tap.test('Ajs methods', async t => {
    t.ok(ajs.get, 'Ajs.get should be defined');
});

// run a mockhttp server
tap.test('Ajs.get', async t => {
    const url = 'https://mockhttp.org/get';
    const response = await ajs.get(url);
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

tap.test('Ajs without errors', async t => {
    const url = 'https://mockhttp.org/status';
    const status = 200;
    const response = await ajs.get(`${url}/200`);
    t.ok(response, 'Ajs.get should return a response');
    t.ok(response.status, 'Ajs.get should return a status');
    t.equal(response.status, status, 'Ajs.get should return a status of 200');
    t.equal(typeof response, 'object', 'Ajs.get should return an object');
    t.ok(response.data, 'Ajs.get should return a data property');
    t.equal(typeof response.data, 'object', 'Ajs.get should return an object');
    t.match(
        response.data.status,
        /200/,
        'Ajs.get should return the correct status'
    );
});

tap.test('Ajs with status errors', async t => {
    const url = 'https://mockhttp.org/status';

    const status = 404;
    try {
        await ajs.get(`${url}/${status}`);
    } catch (error) {
        const response = error as AjsErrorResponse;
        t.ok(response, 'Ajs.get should return a response');
        t.ok(response.status, 'Ajs.get should return a status');
        t.equal(response.status, 404, 'Ajs.get should return a status of 404');
        t.equal(response.error, true, 'Ajs.get should return an error');
        t.equal(
            response.statusText,
            'Not Found',
            'Ajs.get should return the correct statusText'
        );
    }
});

tap.test('Ajs with network errors', async t => {
    const url = 'https://dontexist123.it/';

    try {
        await ajs.get(url);
    } catch (error) {
        const response = error as AjsErrorResponse;
        t.ok(response, 'Ajs.get should return a response');
        t.equal(
            response.status,
            502,
            'Ajs.get should return the correct status'
        );
        t.equal(response.error, true, 'Ajs.get should return an error');
    }
});
