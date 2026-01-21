const winston = require('winston');
const Secrets = require('../utils/secrets.utils');
const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');
const { EnvMode } = require('../utils/enums/env-mode.enum');

class Logger {
    static _logger;

    static getLogger() {
        if(this._logger) {
            return this._logger;
        }

        const logtail = new Logtail(Secrets.BETTERSTACK_LOGGING_KEY, {
            endpoint: `https://${Secrets.BETTERSTACK_HOST}`
        });

        const transports = [];
        if(Secrets.MODE.trim() === EnvMode.DEV || Secrets.MODE.trim() === EnvMode.TEST) {
            transports.push(
                new winston.transports.Console({
                    level: 'info',
                    format: winston.format.prettyPrint()
                })
            );
        } else {
            transports.push(new LogtailTransport(logtail));
        }

        this._logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: transports
        })

        return this._logger
    }

}

module.exports = Logger;