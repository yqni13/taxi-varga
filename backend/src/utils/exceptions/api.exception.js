const { ErrorCodes } = require("../errorCodes.utils");

class ApiException extends Error {
    constructor(code, message, data, status = 503) {
        super(message);
        this.message = message;
        this.name = 'API Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

class UnexpectedApiResponseException extends ApiException {
    constructor(data) {
        super(ErrorCodes.UnexpectedApiResponseException, 'tava-unexpected-api-error', data);
    }
}

module.exports = {
    UnexpectedApiResponseException,
}