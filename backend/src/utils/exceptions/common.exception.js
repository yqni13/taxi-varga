const Secrets = require('../secrets.utils')
const { ErrorCodes } = require('../../utils/errorCodes.utils');
const { ErrorStatusCodes } = require('../../utils/errorStatusCodes.utils');

class CommonException extends Error {
    constructor(code, message, data, status = 500) {
        super(message);
        if(Secrets.MODE === 'development') {
            this.message = message;
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
    constructor(message, data) {
        super(ErrorCodes.InternalServerException, message, data, ErrorStatusCodes.InternalServerException);
    }
}

class NotFoundException extends CommonException {
    constructor(message, data) {
        super(ErrorCodes.NotFoundException, message, data, ErrorStatusCodes.NotFoundException);
    }
}

class MaintenanceException extends CommonException {
    constructor(message, data) {
        super(ErrorCodes.MaintenanceException, message, data, ErrorStatusCodes.MaintenanceException);
    }
}

class RequestExceedMaxException extends CommonException {
    constructor(message = 'backend-max-email', data) {
        super(ErrorCodes.RequestExceedMaxException, message, data, ErrorStatusCodes.RequestExceedMaxException);
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
    NotFoundException,
    MaintenanceException,
    RequestExceedMaxException,
    UnexpectedException
};