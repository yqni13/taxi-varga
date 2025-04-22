
const { ErrorCodes } = require('../errorCodes.utils');
const { ErrorStatusCodes } = require('../errorStatusCodes.utils');

class AuthException extends Error {
    constructor(code, message, data, status = 401) {
        super(message);
        this.message = message;
        this.name = 'Auth Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

class JWTExpirationException extends AuthException {
    constructor (message = 'backend-jwt-expiration', data){
        super(ErrorCodes.JWTExpirationException, message, data);
    }
}

class TokenMissingException extends AuthException {
    constructor (message = 'backend-jwt-missing', data){
        super(ErrorCodes.TokenMissingException, message, data);
    }
}

class InvalidCredentialsException extends AuthException {
    constructor (message, data){
        super(ErrorCodes.InvalidCredentialsException, message, data);
    }
}

class AuthSecretNotFoundException extends AuthException {
    constructor (message, data) {
        super(ErrorCodes.AuthSecretNotFoundException, message, data, ErrorStatusCodes.AuthSecretNotFoundException);
    }
}

module.exports = {
    InvalidCredentialsException,
    AuthSecretNotFoundException,
    TokenMissingException,
    JWTExpirationException
}