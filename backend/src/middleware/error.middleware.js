const Secrets = require('../utils/secrets.utils');
const { InternalServerException } = require('../utils/exceptions/common.exception');
const { JWTExpirationException } = require('../utils/exceptions/auth.exception');

function errorMiddleware(err, req, res, next) {

    let status = err.status ? parseInt(err.status, 10) : 500;

    if((err.status === 500 || !err.message) && !err.isOperational) {
        console.error('InternalServerException was assigned to Error');
        err = new InternalServerException('backend-500-server');
    } else if(err.status === 401 && err.message === 'jwt expired') {
        console.error('JWTExpirationException was assigned to Error');
        err = new JWTExpirationException();
    }

    status = err.status >= 100 && err.status <= 599 ? err.status : 500;
    const code = err.code || 'UNEXPECTED_ERROR';
    const message = err.message || 'Internal Server Error';
    const error = err.error || err.name || 'UnexpectedError';
    const data = err.data || null;

    const testMode = Secrets.MODE === 'development' || Secrets.MODE === 'staging' ? true : false;
    if(testMode) {
        console.error('Exception Handling');
        console.error('Name: ', err.name);
        console.error('Status: ', status);
        console.error('Code: ', code);
        console.error('Message: ', message);
        console.error('Stack: ', err.stack);
    }

    const headers = {
        success: '0',
        error,
        code,
        message,
        ...(data ? data : {})
    };

    if(testMode) {
        console.error('FINAL STATUS SENT: ', status);
    }
    res.status(status).send({ headers, body: {}});
}

module.exports = errorMiddleware;