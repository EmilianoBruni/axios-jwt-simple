import { AxiosError } from 'axios';

export default (error: AxiosError) => {
    const request = error.request;
    const response = error.response;
    const message = error.message;
    if (response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('🟥 \x1b[31m%s\x1b[0m', 'ERROR RESPONSE');
        console.error('%s: \x1b[36m%s\x1b[0m', 'URL', request.path);
        console.error(
            'Status: \x1b[33m%s\x1b[0m - %s',
            response.status,
            response.statusText
        );
        console.error('Data:', response.data);
        console.error('Headers:', response.headers);
        response.data = {
            ...(response.data as object),
            error: true,
            message,
            status: response.status,
            statusText: response.statusText
        };
        return response;
    } else if (request) {
        // The request was made but no response was received
        console.error('🟥 \x1b[31m%s\x1b[0m', 'REQUEST ERROR');
        console.error('%s: \x1b[36m%s\x1b[0m', 'URL', request._currentUrl);
        console.error('%s: \x1b[36m%s\x1b[0m', 'Cause', message);
        // return { error: true, message: 'REQUEST Error: ' + message };
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
        // Something happened in setting up the request that triggered an Error
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
