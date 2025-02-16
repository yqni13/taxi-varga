require('dotenv').config();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { 
    AuthSecretNotFoundException, 
    InvalidCredentialsException 
} = require('../utils/exceptions/auth.exception');
const { Config } = require('../configs/config')
const Decryption = require('../utils/decryption.utils');

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
        const position = Number(Config.PASS_POSITION);
        if(!position) {
            throw new AuthSecretNotFoundException('backend-404-position');
        }
        
        const id = Config.AUTH_ID;
        if(!id) {
            throw new AuthSecretNotFoundException('backend-404-id');
        }

        const user = Config.AUTH_USER;
        if(!user) {
            throw new AuthSecretNotFoundException('backend-404-user');
        }

        const password = Config.AUTH_PASS;
        if(!password) {
            throw new AuthSecretNotFoundException('backend-404-pass');
        }

        if(!Config.AUTH_KEY) {
            throw new AuthSecretNotFoundException('backend-404-key');
        }
        let privateKey;
        if(Config.MODE === 'development') {
            privateKey = fs.readFileSync(Config.AUTH_KEY, 'utf8');
        } else {
            privateKey = Config.AUTH_KEY;
        }

        const decryptedUser = Decryption.decryptionRSA(params['user'], privateKey);
        if(decryptedUser !== user) {
            throw new InvalidCredentialsException('backend-invalid-user');
        }

        const decryptedPass = Decryption.decryptionRSA(params['pass'], privateKey);
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

module.exports = new AuthModel();