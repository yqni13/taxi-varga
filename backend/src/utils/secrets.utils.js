const { Config } = require('../configs/config');
const { AuthSecretNotFoundException } = require('./exceptions/auth.exception');
const fs = require('fs');

class Secrets {

    MODE = '';
    GOOGLE_API_KEY = '';
    HOME_ADDRESS = '';
    EMAIL_RECEIVER = '';
    EMAIL_SENDER = '';
    EMAIL_PASS = '';
    EMAIL_SUBJECT = '';
    PASS_POSITION = 0;
    IV_POSITION = 0;
    AUTH_ID = '';
    AUTH_USER = '';
    AUTH_PASS = '';
    PUBLIC_KEY = '';
    PRIVATE_KEY = '';

    constructor() {
        this.MODE = this.#setMode();
        this.GOOGLE_API_KEY = this.#setAPIKey();
        this.HOME_ADDRESS = this.#setAddressHome();
        this.EMAIL_RECEIVER = this.#setEmailReceiver();
        this.EMAIL_SENDER = this.#setEmailSender();
        this.EMAIL_PASS = this.#setEmailPass();
        this.EMAIL_SUBJECT = this.#setEmailSubject();
        this.PASS_POSITION = this.#setPassPosition();
        this.IV_POSITION = this.#setIVPosition();
        this.AUTH_ID = this.#setAuthId();
        this.AUTH_USER = this.#setAuthUser();
        this.AUTH_PASS = this.#setAuthPass();
        this.PUBLIC_KEY = this.#setPublicKey();
        this.PRIVATE_KEY = this.#setPrivateKey();
    }

    #setMode = () => {
        if(!Config.MODE) {
            throw new AuthSecretNotFoundException('backend-404-env#MODE');
        }
        return Config.MODE;
    }

    #setAPIKey = () => {
        if(!Config.GOOGLE_API_KEY) {
            throw new AuthSecretNotFoundException('backend-404-env#GOOGLE_API_KEY');
        }
        return Config.GOOGLE_API_KEY;
    }

    #setAddressHome = () => {
        if(!Config.HOME_ADDRESS) {
            throw new AuthSecretNotFoundException('backend-404-env#HOME_ADDRESS');
        }
        return Config.HOME_ADDRESS;
    }

    #setEmailReceiver = () => {
        if(!Config.EMAIL_RECEIVER) {
            throw new AuthSecretNotFoundException('backend-404-env#EMAIL_RECEIVER');
        }
        return Config.EMAIL_RECEIVER;
    }

    #setEmailSender = () => {
        if(!Config.EMAIL_SENDER) {
            throw new AuthSecretNotFoundException('backend-404-env#EMAIL_SENDER');
        }
        return Config.EMAIL_SENDER;
    }

    #setEmailPass = () => {
        if(!Config.EMAIL_PASS) {
            throw new AuthSecretNotFoundException('backend-404-env#EMAIL_PASS');
        }
        return Config.EMAIL_PASS;
    }

    #setEmailSubject = () => {
        if(!Config.EMAIL_SUBJECT) {
            throw new AuthSecretNotFoundException('backend-404-env#EMAIL_SUBJECT');
        }
        return Config.EMAIL_SUBJECT;
    }

    #setPassPosition = () => {
        if(!Config.PASS_POSITION) {
            throw new AuthSecretNotFoundException('backend-404-env#PASS_POSITION');
        }
        return Number(Config.PASS_POSITION);
    }

    #setIVPosition = () => {
        if(!Config.IV_POSITION) {
            throw new AuthSecretNotFoundException('backend-404-env#IV_POSITION');
        }
        return Number(Config.IV_POSITION);
    }

    #setAuthId = () => {
        if(!Config.AUTH_ID) {
            throw new AuthSecretNotFoundException('backend-404-env#AUTH_ID')
        }
        return Config.AUTH_ID;
    }

    #setAuthUser = () => {
        if(!Config.AUTH_USER) {
            throw new AuthSecretNotFoundException('backend-404-env#AUTH_USER')
        }
        return Config.AUTH_USER;
    }

    #setAuthPass = () => {
        if(!Config.AUTH_PASS) {
            throw new AuthSecretNotFoundException('backend-404-env#AUTH_PASS')
        }
        return Config.AUTH_PASS;
    }

    #setPublicKey = () => {
        let key;
        if(Config.MODE === 'development') {
            key = fs.readFileSync(Config.PUBLIC_KEY, 'utf8');
        } else {
            key = Config.PUBLIC_KEY;
        }
        
        if(!key) {
            throw new AuthSecretNotFoundException('backend-404-env#PUBLIC_KEY');
        }    
        return key;
    }

    #setPrivateKey = () => {
        let key;
        if(Config.MODE === 'development') {
            key = fs.readFileSync(Config.PRIVATE_KEY, 'utf8');
        } else {
            key = Config.PRIVATE_KEY;
        }
    
        if(!key) {
            throw new AuthSecretNotFoundException('backend-404-env#PRIVATE_KEY');
        }    
        return key;
    }
}

module.exports = new Secrets();

