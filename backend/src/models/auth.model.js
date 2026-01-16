const jwt = require('jsonwebtoken');
const { InvalidCredentialsException } = require('../utils/exceptions/auth.exception');
const Secrets = require('../utils/secrets.utils');
const { decryptRSA } = require('../utils/crypto.utils');

class AuthModel {
    msg0 = '';
    msg1 = '';

    constructor() {
        this.msg0 = 'Error';
        this.msg1 = 'Success';
    }

    async generateToken(params) {
        // ENCRYPT / COMPARE - LOGIN DATA
        const position = Secrets.PASS_POSITION;
        const id = Secrets.AUTH_ID;
        const user = Secrets.AUTH_USER;
        const password = Secrets.AUTH_PASS;
        const role = Secrets.AUTH_ROLE;
        const issuer = Secrets.AUTH_ISSUER;
        const privateKey = Secrets.PRIVATE_KEY;

        const decryptedUser = decryptRSA(params['user'], privateKey);
        if(decryptedUser !== user) {
            throw new InvalidCredentialsException('backend-invalid-user');
        }

        const decryptedPass = decryptRSA(params['pass'], privateKey);
        if(decryptedPass.substring(0, position) !== password) {
            throw new InvalidCredentialsException('backend-invalid-pass');
        }

        // CREATE - SESSION TOKEN
        const payload = {
            id: id,
            user: decryptedUser + String(Date.now()),
            role: role
        }

        const options = {
            expiresIn: '30m',
            algorithm: 'RS256',
            audience: params['aud'],
            issuer: issuer
        }

        const token = jwt.sign(payload, privateKey, options)
        return {
            body: {
                token: token
            },
            code: 1,
            msg: this.msg1
        }
    }
}

module.exports = AuthModel;