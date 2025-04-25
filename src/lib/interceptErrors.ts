import { AxiosError } from 'axios';

/**
 * Intercepts and handles Axios errors, providing detailed logging and a standardized error response.
 *
 * @param error - The Axios error object.
 * @returns A modified response object with error details or a standardized error structure.
 */
export default (error: AxiosError) => {
    const request = error.request; // The request object associated with the error
    const response = error.response; // The response object, if available
    const message = error.message; // The error message

    if (response) {
        // The request was made, and the server responded with a status code
        // that falls outside the range of 2xx
        console.error('🟥 \x1b[31m%s\x1b[0m', 'ERROR RESPONSE');
        console.error('%s: \x1b[36m%s\x1b[0m', 'URL', request.path);
        console.error(
            'Status: \x1b[33m%s\x1b[0m - %s',
            response.status,
            response.statusText
        );
        console.error('Data:', response.data);
        console.error('Headers:', response.headers);

        // Add error details to the response data
        response.data = {
            ...(response.data as object),
            error: true,
            message,
            status: response.status,
            statusText: response.statusText
        };

        return response; // Return the modified response object
    } else if (request) {
        // The request was made, but no response was received
        console.error('🟥 \x1b[31m%s\x1b[0m', 'REQUEST ERROR');
        console.error('%s: \x1b[36m%s\x1b[0m', 'URL', request._currentUrl);
        console.error('%s: \x1b[36m%s\x1b[0m', 'Cause', message);

        // Return a standardized error object for request errors
        return {
            data: {
                error: true,
                message: message,
                status: 0,
                statusText: 'REQUEST Error'
            },
            status: 0,
            statusText: 'REQUEST Error',
            config: request
        };
    } else {
        // Something happened in setting up the request that triggered an error
        console.error('🟥 \x1b[31m%s\x1b[0m', 'UNKNOWN ERROR');
        console.error('%s: \x1b[36m%s\x1b[0m', 'Cause', message);

        // Return a standardized error object for unknown errors
        return {
            data: {
                error: true,
                message: message,
                status: 0,
                statusText: 'REQUEST Error'
            },
            status: 0,
            statusText: 'REQUEST Error'
        };
    }
};
