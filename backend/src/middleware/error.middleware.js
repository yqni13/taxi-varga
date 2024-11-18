const { Config } = require('../configs/config');
const { InternalServerException, UnexpectedException } = require('../utils/exceptions/common.exception');

function errorMiddleware(err, req, res, next) {

    switch(err.status) {
        case(500):
            err = new InternalServerException('Internal Server Error');
        default:
            err = new UnexpectedException();
    }

    let { message, code, error, status, data, stack } = err;

    if(Config.MODE === 'development') {
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