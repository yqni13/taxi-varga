const Secrets = require('../utils/secrets.utils');
const { InternalServerException } = require('../utils/exceptions/common.exception');
const { JWTExpirationException } = require('../utils/exceptions/auth.exception');

function errorMiddleware(err, req, res, next) {

    if((err.status === 500 || !err.message) && !err.isOperational) {
        err = new InternalServerException('backend-500-server');
    } else if(err.status === 401 && err.message === 'jwt expired') {
        err = new JWTExpirationException();
    }

    const status = Number.isInteger(err.status) && err.status >= 100 && err.status <= 599 ? err.status : 500;
    const code = err.code || 'UNEXPECTED_ERROR';
    const message = err.message || 'Internal Server Error';
    const error = err.error || err.name || 'UnexpectedError';
    const data = err.data || null;

    if(Secrets.MODE === 'development' || Secrets.MODE === 'staging') {
        console.error('Exception Handling');
        console.error('Name: ', err.name);
        console.error('Status: ', status);
        console.error('Code: ', code);
        console.error('Message: ', message);
        console.error('Stack: ', stack);
    }

    const headers = {
        success: '0',
        error,
        code,
        message,
        ...(data ? data : {})
    };

    res.status(status).json({ headers, body: {}});
}

module.exports = errorMiddleware;