const Secrets = require('../utils/secrets.utils');
const { InternalServerException, UnexpectedException } = require('../utils/exceptions/common.exception');
const { JWTExpirationException } = require('../utils/exceptions/auth.exception');

function errorMiddleware(err, req, res, next) {

    if((err.status === 500 || !err.message) && !err.isOperational) {
        err = new InternalServerException('Internal Server Error');
    } else if(err.status === 401 && err.message === 'jwt expired') {
        err = new JWTExpirationException();
    } else {
        err = new UnexpectedException();
    }

    let { message, code, error, status, data, stack } = err;

    if(Secrets.MODE === 'development') {
        console.log(`[Exception] ${error}, [Code] ${code}`);
        console.log(`[Error] ${message}`);
        console.log(`[Stack] ${stack}`);
    }

    const headers = {
        success: "0",
        error,
        code,
        message,
        ...(data) && data
    };

    res.status(status).send({ headers, body: {}});
}

module.exports = errorMiddleware;