require('dotenv').config();
const { AuthenticationException, InternalServerException } = require("../utils/exceptions/common.exception");
const nodemailer = require('nodemailer');

class MailingModel {
    sendMail = async (params = {}) => {
        const sender = params['sender'];
        const subject = params['subject'];
        const message = params['body'];
        var result;

        const transporter = nodemailer.createTransport({
            service: 'gmx',
            host: 'mail.gmx.com',
            port: 465,
            secure: true,
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            },
            auth: {
                user: process.env.SECRET_EMAIL_SENDER,
                pass: process.env.SECRET_EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.SECRET_EMAIL_SENDER,
            // to: process.env.SECRET_EMAIL_RECEIVER,
            to: sender,
            subject: subject,
            text: message
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                if(error.responseCode === 535) {
                    throw new AuthenticationException();
                } else {
                    throw new InternalServerException();
                }
            } else {
                result = info.response;
            }
        })
        return {response: result};
    }
}

module.exports = new MailingModel;