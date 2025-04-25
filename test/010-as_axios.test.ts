import tap from 'tap';
import ajs from '@/index.js';
import { stringify } from 'querystring';

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
    const url = 'https://jsonplaceholder.typicode.com/posts/1';
    const response = await ajs.get<{id: string, title: string}>(url);
    t.ok(response, 'Ajs.get should return a response');
    t.ok(response.status, 'Ajs.get should return a status');
    t.equal(response.status, 200, 'Ajs.get should return a status of 200');
    t.ok(response.statusText, 'Ajs.get should return a statusText');
    t.equal(response.statusText, 'OK', 'Ajs.get should return a statusText of OK');
    t.equal(typeof response, 'object', 'Ajs.get should return an object');
    t.ok(response.data, 'Ajs.get should return a data property');
    t.equal(typeof response.data, 'object', 'Ajs.get should return an object');
    console.log(response.data);
    t.equal(response.data.id, 1, 'Ajs.get should return the correct id');
    t.equal(response.data.title, 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit', 'Ajs.get should return the correct title');
    t.end();
});


