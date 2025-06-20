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

    generateToken = async (params) => {
        if(!Object.keys(params).length) {
            return {
                body: {
                    error: 'no params found'
                },
                code: 0,
                msg: this.msg0
            };
        }

        // ENCRYPT / COMPARE - LOGIN DATA
        const position = Secrets.PASS_POSITION;
        const id = Secrets.AUTH_ID;
        const user = Secrets.AUTH_USER;
        const password = Secrets.AUTH_PASS;
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
            role: 'user'
        }

        const options = {
            expiresIn: '30m',
            algorithm: 'RS256',
            audience: params['aud'],
            issuer: 'https://taxi-varga.at'
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