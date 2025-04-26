import { AxiosError } from 'axios';

import type { AjsErrorResponse } from '@/types.js';

/**
 * Intercepts and handles Axios errors, providing detailed logging and a standardized error response.
 *
 * @param error - The Axios error object.
 * @returns A modified response object with error details or a standardized error structure.
 */
export default (error: AxiosError): AjsErrorResponse => {
    const request = error.request; // The request object associated with the error
    const response = error.response; // The response object, if available
    const message = error.message; // The error message

    if (response) {
        // The request was made, and the server responded with a status code
        // that falls outside the range of 2xx
        console.error('🟥 \x1b[31m%s\x1b[0m', 'ERROR AXIOS RESPONSE');
        console.error('%s: \x1b[36m%s\x1b[0m', 'URL', request.path);
        console.error(
            'Status: \x1b[33m%s\x1b[0m - %s',
            response.status,
            response.statusText
        );
        console.error('Data:', response.data);
        console.error('Headers:', response.headers);

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
        console.error('🟥 \x1b[31m%s\x1b[0m', 'REQUEST ERROR');
        console.error('%s: \x1b[36m%s\x1b[0m', 'URL', request._currentUrl);
        console.error('%s: \x1b[36m%s\x1b[0m', 'Cause', message);

        const errorResponse: AjsErrorResponse = {
            error: true,
            messageError: message,
            status: 502,
            statusText: 'REQUEST Error'
        };
        return errorResponse;
    } else {
        // Something happened in setting up the request that triggered an error
        console.error('🟥 \x1b[31m%s\x1b[0m', 'UNKNOWN ERROR');
        console.error('%s: \x1b[36m%s\x1b[0m', 'Cause', message);

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
