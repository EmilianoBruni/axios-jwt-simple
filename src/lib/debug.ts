/**
 * Checks if debug mode is enabled either via the instance flag or the AJS_DEBUG env variable.
 *
 * @param debug - The debug flag from the Axios instance.
 * @returns `true` if debug mode is enabled, `false` otherwise.
 */
const isDebugEnabled = (debug?: boolean): boolean => {
    return !!(debug || process.env.AJS_DEBUG);
};

/**
 * Logs a warning message only when debug mode is enabled.
 *
 * @param debug - The debug flag from the Axios instance.
 * @param args - Arguments forwarded to `console.warn`.
 */
const debugWarn = (
    debug: boolean | undefined,
    ...args: Parameters<typeof console.warn>
): void => {
    if (isDebugEnabled(debug)) {
        console.warn(...args);
    }
};

/**
 * Logs an error message only when debug mode is enabled.
 *
 * @param debug - The debug flag from the Axios instance.
 * @param args - Arguments forwarded to `console.error`.
 */
const debugError = (
    debug: boolean | undefined,
    ...args: Parameters<typeof console.error>
): void => {
    if (isDebugEnabled(debug)) {
        console.error(...args);
    }
};

export { isDebugEnabled, debugWarn, debugError };
