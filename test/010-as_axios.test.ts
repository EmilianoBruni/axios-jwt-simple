import tap from 'tap';
import ajs from '@/index.js';

tap.test('Ajs instance', t => {
    t.ok(ajs, 'Ajs instance should be created');
    t.equal(typeof ajs, 'function', 'Ajs should be an object');
    t.equal(typeof ajs.get, 'function', 'Ajs.get should be a function');
    t.end();
});

tap.test('Ajs methods', t => {
    t.ok(ajs.get, 'Ajs.get should be defined');
    t.end();
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
    t.end();
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
    t.end();
});

tap.test('Ajs with status errors', async t => {
    const url = 'https://mockhttp.org/status';

    const status = 404;
    const response = await ajs.get(`${url}/${status}`);
    t.ok(response, 'Ajs.get should return a response');
    t.ok(response.status, 'Ajs.get should return a status');
    t.equal(response.status, 404, 'Ajs.get should return a status of 404');
    t.ok(response.data, 'Ajs.get should return a data property');
    t.equal(typeof response.data, 'object', 'Ajs.get should return an object');
    t.equal(
        response.data.status,
        status,
        'Ajs.get should return the correct status'
    );
    t.equal(response.data.error, true, 'Ajs.get should return an error');
    t.equal(
        response.data.statusText,
        'Not Found',
        'Ajs.get should return the correct statusText'
    );
    t.end();
});

tap.test('Ajs with network errors', async t => {
    const url = 'https://dontexist123.it/';

    const response = await ajs.get(url);
    t.ok(response, 'Ajs.get should return a response');
    t.ok(response.data, 'Ajs.get should return a data property');
    t.equal(typeof response.data, 'object', 'Ajs.get should return an object');
    t.equal(
        response.data.status,
        0,
        'Ajs.get should return the correct status'
    );
    t.equal(response.data.error, true, 'Ajs.get should return an error');
    t.end();
});
