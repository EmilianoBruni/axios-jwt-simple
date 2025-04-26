import tap from 'tap';
import axios from 'axios';
import { ajsAttach } from '@/index.js';
import { fakeJwtAjs, generateFakeJwtToken, checkBearer } from './utils.js';
import { AjsStatic } from '@/types.js';

tap.test(
    'Attach multiple times to the same default Axios instance without init JWT',
    async t => {
        const ajs = ajsAttach(axios);

        const url = 'https://mockhttp.org/get';
        const response = await ajs.get(url);
        t.equal(
            response.data.method,
            'GET',
            'Ajs.get should return the correct method'
        );

        const ajs1 = ajsAttach(axios);
        const response1 = await ajs1.get(url);
        t.equal(
            response1.data.method,
            'GET',
            'Ajs.get should return the correct method'
        );
    }
);

tap.test('Attach to default Axios instance with init JWT', async t => {
    const ajs = ajsAttach(axios);

    const accessToken = generateFakeJwtToken(3600);
    const refreshToken = generateFakeJwtToken(7200);
    fakeJwtAjs(ajs, accessToken, refreshToken);
    await checkBearer(t, ajs, accessToken);
});

tap.test('Againt to the same default Axios instance', async t => {
    const ajs = ajsAttach(axios);

    const accessToken = generateFakeJwtToken(3600);
    const refreshToken = generateFakeJwtToken(7200);
    fakeJwtAjs(ajs, accessToken, refreshToken);
    await checkBearer(t, ajs, accessToken);
});

tap.test('Attach twince to default Axios instance', async t => {
    const ajs = ajsAttach(axios);

    const accessToken = generateFakeJwtToken(3600);
    const refreshToken = generateFakeJwtToken(7200);
    fakeJwtAjs(ajs, accessToken, refreshToken);
    await checkBearer(t, ajs, accessToken);

    const ajs1 = ajsAttach(axios);

    const accessToken1 = generateFakeJwtToken(3600);
    const refreshToken1 = generateFakeJwtToken(7200);
    fakeJwtAjs(ajs1, accessToken1, refreshToken1);
    await checkBearer(t, ajs1, accessToken1);
    t.equal(ajs1, ajs, 'Ajs and Ajs1 should be the same instance');
});

tap.test('Attach to default axios and then use it', async t => {
    const ajs = ajsAttach(axios);

    const accessToken = generateFakeJwtToken(3600);
    const refreshToken = generateFakeJwtToken(7200);
    fakeJwtAjs(ajs, accessToken, refreshToken);
    await checkBearer(t, axios as AjsStatic, accessToken);
});

tap.test('Attach only', async t => {
    ajsAttach(axios);

    const accessToken = generateFakeJwtToken(3600);
    const refreshToken = generateFakeJwtToken(7200);
    fakeJwtAjs(axios as AjsStatic, accessToken, refreshToken);
    await checkBearer(t, axios as AjsStatic, accessToken);
});
