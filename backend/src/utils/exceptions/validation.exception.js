const { Config } = require('../../configs/config');
const { ErrorCodes } = require('../errorCodes.utils');
const { ErrorStatusCodes } = require('../errorStatusCodes.utils');

class ValidationException extends Error {
    constructor(code, message, data, status = 400) {
        super(message);
        if(Config.MODE === 'development') {
            this.message = 'Validation Error: ' + message;
        } else {
            this.message = message;
        }
        this.name = 'Validation Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

class InvalidPropertiesException extends ValidationException {
    constructor(data) {
        super(ErrorCodes.InvalidPropertiesException, 'Properties invalid', data, ErrorStatusCodes.InvalidPropertiesException);
    }
}

module.exports = { InvalidPropertiesException };