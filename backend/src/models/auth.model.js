require('dotenv').config();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const { 
    AuthSecretNotFoundException, 
    InvalidCredentialsException 
} = require('../utils/exceptions/auth.exception');
const { Config } = require('../configs/config')

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

        const id = Config.AUTH_ID;
        if(!id) {
            throw new AuthSecretNotFoundException('private id not set');
        }

        let privateKey;
        if(Config.MODE === 'development') {
            privateKey = fs.readFileSync(Config.AUTH_KEY, 'utf8');
        } else {
            privateKey = Config.AUTH_KEY
        }

        if(!privateKey) {
            throw new AuthSecretNotFoundException('private key not set');
        }

        const authentication = String(CryptoJS.AES.decrypt(params['pass'].toString(), privateKey));
        const validRange = Date.now();
        const initTime = Number(authentication.substring(32, authentication.length)) + (3 * 60 * 1000);
        if(authentication.substring(0,32) !== Config.AUTH_PASS && initTime > validRange) {
            throw new InvalidCredentialsException('invalid password');
        }

        const payload = {
            id: id,
            user: params['user'] + String(Date.now()),
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