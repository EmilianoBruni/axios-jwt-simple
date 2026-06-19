import { AxiosError } from 'axios';

import type { AjsErrorResponse } from '@/types.js';
import { debugError } from '@/lib/debug.js';

/**
 * Intercepts and handles Axios errors, providing a standardized error response.
 * Detailed logging is only emitted when debug mode is enabled.
 *
 * @param error - The Axios error object.
 * @param debug - Whether debug logging is enabled.
 * @returns A modified response object with error details or a standardized error structure.
 */
export default (error: AxiosError, debug: boolean): AjsErrorResponse => {
    const request = error.request; // The request object associated with the error
    const response = error.response; // The response object, if available
    const message = error.message; // The error message

    if (response) {
        // The request was made, and the server responded with a status code
        // that falls outside the range of 2xx
        debugError(debug, `🟥 \x1b[31mERROR AXIOS RESPONSE\x1b[0m`);
        debugError(
            debug,
            `URL: \x1b[36m${request.path || request.responseURL}\x1b[0m`
        );
        debugError(
            debug,
            `Status: \x1b[33m${response.status}\x1b[0m - ${response.statusText}`
        );
        debugError(
            debug,
            `response.data: \x1b[36m${JSON.stringify(response.data, null, 2)}\x1b[0m`
        );
        debugError(
            debug,
            `response.headers: \x1b[36m${JSON.stringify(response.headers, null, 2)}\x1b[0m`
        );

        // Add error details to the response data
        const errorResponse: AjsErrorResponse = {
            ...(response.data as Partial<AjsErrorResponse>),
            error: true,
            messageError: message,
            status: response.status,
            statusText: response.statusText
        };

        return errorResponse;
    } else if (request) {
        // The request was made, but no response was received
        debugError(debug, `🟥 \x1b[31mREQUEST ERROR\x1b[0m`);
        debugError(debug, `URL: \x1b[36m${request._currentUrl}\x1b[0m`);
        debugError(debug, `Cause: \x1b[36m${message}\x1b[0m`);

        const errorResponse: AjsErrorResponse = {
            error: true,
            messageError: message,
            status: 502,
            statusText: 'REQUEST Error'
        };
        return errorResponse;
    } else {
        // Something happened in setting up the request that triggered an error
        debugError(debug, `🟥 \x1b[31mUNKNOWN ERROR\x1b[0m`);
        debugError(debug, `Cause: \x1b[36m${message}\x1b[0m`);

        // Return a standardized error object for unknown errors
        const errorResponse: AjsErrorResponse = {
            error: true,
            messageError: message,
            status: 500,
            statusText: 'REQUEST Error'
        };
        return errorResponse;
    }
};
