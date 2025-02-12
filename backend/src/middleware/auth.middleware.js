require('dotenv').config();
const jwt = require('jsonwebtoken');
const { 
    InvalidCredentialsException 
} = require('../utils/exceptions/auth.exception');

const auth = () => {
    return async function (req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const bearer = 'Bearer ';
            if (!authHeader || !authHeader.startsWith(bearer)) {
                throw new TokenMissingException('no token set');
            }

            const privateKey = Config.AUTH_KEY;
            const token = authHeader.replace(bearer, '');
            const decode = jwt.verify(token, privateKey);

            if(decode.id !== Config.AUTH_ID) {
                throw new InvalidCredentialsException('invalid identifier');
            }

            next();

        } catch(error) {
            error.status = 401;
            console.log('AUTH ERROR ON VERIFICATION (Auth Model): ', error.message);
            next({
                body: {
                    error: error
                },
                code: 0,
                msg: this.msg0
            });
        }
        
    };
}

module.exports = auth;