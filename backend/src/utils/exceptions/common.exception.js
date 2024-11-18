const { ErrorCodes } = require('../../utils/errorCodes.utils');
const { ErrorStatusCodes } = require('../../utils/errorStatusCodes.utils');

class CommonException extends Error {
    constructor(code, message, data, status = 500) {
        super(message);
        this.name = 'Common Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

class InternalServerException extends CommonException {
    constructor(data) {
        super(ErrorCodes.InternalServerException, 'Server not connected', data, ErrorStatusCodes.InternalServerException);
    }
}

class NotFoundException extends CommonException {
    constructor(message, data) {
        super(ErrorCodes.NotFoundException, message, data, ErrorStatusCodes.NotFoundException);
    }
}

class UnexpectedException extends CommonException {
    constructor(data) {
        super(ErrorCodes.UnexpectedException, 'Unexpected Error', data, ErrorStatusCodes.UnexpectedException);
    }
}

module.exports = {
    InternalServerException,
    NotFoundException,
    UnexpectedException
};