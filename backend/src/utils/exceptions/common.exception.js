const { Config } = require('../../configs/config');
const { ErrorCodes } = require('../../utils/errorCodes.utils');
const { ErrorStatusCodes } = require('../../utils/errorStatusCodes.utils');

class CommonException extends Error {
    constructor(code, message, data, status = 500) {
        super(message);
        if(Config.MODE === 'development') {
            this.message = 'Common Error: ' + message;
        } else {
            this.message = message;
        }
        this.name = 'Common Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

class AuthenticationException extends CommonException {
    constructor(message, data) {
        super(ErrorCodes.AuthenticationException, message, data, ErrorStatusCodes.AuthenticationException);
    }
}

class InternalServerException extends CommonException {
    constructor(data) {
        super(ErrorCodes.InternalServerException, 'Server not connected', data, ErrorStatusCodes.InternalServerException);
    }
}

class UnexpectedException extends CommonException {
    constructor(message, data) {
        super(ErrorCodes.UnexpectedException, message, data, ErrorStatusCodes.UnexpectedException);
    }
}

module.exports = {
    AuthenticationException,
    InternalServerException,
    UnexpectedException
};