const { ErrorCodes } = require('../../utils/errorCodes.utils');
const { ErrorStatusCodes } = require('../../utils/errorStatusCodes.utils');

class ApiException extends Error {
    constructor(code, message, data, status = 400) {
        super(message);
        this.name = 'API Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

class InvalidEndpointException extends ApiException {
    constructor(message = 'Endpoint not found', data) {
        super(ErrorCodes.InvalidEndpointException, message, data, ErrorStatusCodes.InvalidEndpointException);
    }
}

class InvalidTokenException extends ApiException {
    constructor(message = 'Token invalid', data) {
        super(ErrorCodes.InvalidTokenException, message, data, ErrorStatusCodes.InvalidTokenException);
    }
}

class UnimplementedException extends ApiException {
    constructor(message = 'API not implemented', data) {
        super(ErrorCodes.UnimplementedException, message, data, ErrorStatusCodes.UnimplementedException);
    }
}

class HealthCheckFailedException extends ApiException {
    constructor(data) {
        super(ErrorCodes.HealthCheckFailedException, 'API failed to run', data, ErrorStatusCodes.HealthCheckFailedException);
    }
}

module.exports = {
    InvalidEndpointException,
    InvalidTokenException,
    UnimplementedException,
    HealthCheckFailedException
};

