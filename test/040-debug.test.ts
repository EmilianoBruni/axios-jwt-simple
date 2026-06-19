import tap from 'tap';
import { ajsAttach } from '@/index.js';
import axios from 'axios';
import { isDebugEnabled } from '@/lib/debug.js';

/**
 * Test case for debug mode disabled by default.
 */
tap.test('Debug mode is disabled by default', async t => {
    const ajs = ajsAttach(axios.create());
    t.equal(ajs.debug, false, 'debug should be false by default');
});

/**
 * Test case for enabling debug mode via property.
 */
tap.test('Debug mode can be enabled via property', async t => {
    const ajs = ajsAttach(axios.create());
    ajs.debug = true;
    t.equal(ajs.debug, true, 'debug should be true after setting it');
});

/**
 * Test case for isDebugEnabled helper with explicit flag.
 */
tap.test('isDebugEnabled returns correct values', async t => {
    t.equal(
        isDebugEnabled(false),
        false,
        'should be false when debug is false'
    );
    t.equal(isDebugEnabled(true), true, 'should be true when debug is true');
    t.equal(
        isDebugEnabled(undefined),
        false,
        'should be false when debug is undefined'
    );
});

/**
 * Test that console.warn is suppressed when debug is off.
 */
tap.test('console.warn is suppressed when debug is off', async t => {
    const warnings: unknown[][] = [];
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
        warnings.push(args);
    };

    const ajs = ajsAttach(axios.create());
    t.equal(ajs.debug, false, 'debug should be false');

    // Trigger a warn by calling ajsAttach again on same instance (jwtMode already set)
    ajs.jwtMode = [0, 0]; // simulate already enabled
    ajsAttach(ajs);

    console.warn = originalWarn;
    t.equal(
        warnings.length,
        0,
        'no warnings should be emitted when debug is off'
    );
});

/**
 * Test that console.warn is emitted when debug is on.
 */
tap.test('console.warn is emitted when debug is on', async t => {
    const warnings: unknown[][] = [];
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
        warnings.push(args);
    };

    const ajs = ajsAttach(axios.create());
    ajs.debug = true;

    // Trigger a warn by simulating jwtMode already enabled
    ajs.jwtMode = [0, 0];
    ajsAttach(ajs);

    console.warn = originalWarn;
    t.ok(warnings.length > 0, 'warnings should be emitted when debug is on');
});

/**
 * Test that AJS_DEBUG environment variable enables debug mode.
 */
tap.test('AJS_DEBUG env variable enables debug logging', async t => {
    const originalEnv = process.env.AJS_DEBUG;
    process.env.AJS_DEBUG = '1';

    t.equal(
        isDebugEnabled(false),
        true,
        'should be true when AJS_DEBUG env variable is set'
    );

    process.env.AJS_DEBUG = originalEnv;
});
