require('dotenv').config();
const { AuthenticationException, InternalServerException } = require("../utils/exceptions/common.exception");
const nodemailer = require('nodemailer');

class MailingModel {
    sendMail = async (params = {}) => {
        const sender = params['sender'];
        const subject = params['subject'];
        const message = params['body'];

        const mailOptions = {
            from: process.env.SECRET_EMAIL_SENDER,
            to: process.env.SECRET_EMAIL_RECEIVER,
            subject: subject,
            text: message
        };
        
        const success = await this.wrapedSendMail(mailOptions);
        
        return {response: {
            success: success,
            sender: sender
        }};
    }

    async wrapedSendMail(mailOptions) {
        return new Promise((resolve, reject) => {
            const transporter = nodemailer.createTransport({
                service: 'gmx',
                host: 'mail.gmx.com',
                port: 465,
                secure: true,
                tls: {
                    secure: true,
                    ciphers: 'SSLv3',
                    rejectUnauthorized: false
                },
                auth: {
                    user: process.env.SECRET_EMAIL_SENDER,
                    pass: process.env.SECRET_EMAIL_PASS
                }
            });

            transporter.sendMail(mailOptions, function(error, info) {
                if(error) {
                    reject(false);
                    if(error.responseCode === 535) {
                        throw new AuthenticationException();
                    } else {
                        throw new InternalServerException();
                    }
                } else {
                    resolve(true);
                }
            })
        })
    }
}

module.exports = new MailingModel;