require('dotenv').config();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { 
    InvalidCredentialsException,
    TokenMissingException
} = require('../utils/exceptions/auth.exception');
const { Config } = require('../configs/config');

const auth = () => {
    return async function (req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const bearer = 'Bearer ';
            if (!authHeader || !authHeader.startsWith(bearer)) {
                throw new TokenMissingException();
            }

            const privateKey = fs.readFileSync(Config.AUTH_KEY, 'utf8');
            const token = authHeader.replace(bearer, '');
            const decode = jwt.verify(token, privateKey);

            if(decode.id !== Config.AUTH_ID) {
                throw new InvalidCredentialsException('backend-invalid-id');
            }
            
            next();

        } catch(error) {
            console.log('AUTH ERROR ON VERIFICATION (Auth Model): ', error.message);
            error.status = 401;
            next(error);
        }
        
    };
}

module.exports = auth;