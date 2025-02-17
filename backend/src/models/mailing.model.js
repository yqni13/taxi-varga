require('dotenv').config();
const nodemailer = require('nodemailer');
const { 
    AuthenticationException, 
    UnexpectedException 
} = require("../utils/exceptions/common.exception");
const { AuthSecretNotFoundException } = require('../utils/exceptions/auth.exception');
const { Config } = require('../configs/config');

class MailingModel {
    sendMail = async (params) => {
        if(!Object.keys(params).length) {
            return { error: 'no params found' };
        }

        const emailSender = Config.EMAIL_SENDER;
        if(!emailSender) {
            throw new AuthSecretNotFoundException('backend-404-emailsender');
        }

        const emailReceiver = Config.EMAIL_RECEIVER;
        if(!emailReceiver) {
            throw new AuthSecretNotFoundException('backend-404-emailreceiver');
        }

        const emailPass = Config.EMAIL_PASS;
        if(!emailPass) {
            throw new AuthSecretNotFoundException('backend-404-emailpass');
        }

        const sender = params['sender'];
        const subject = params['subject'];
        const msgRequest = params['body'];
        const msgConfirm = params['confirm'];

        const mailOptionsRequest = {
            from: emailSender,
            to: emailReceiver,
            subject: subject,
            text: msgRequest
        };

        const mailOptionsConfirm = {
            from: emailSender,
            to: sender,
            subject: 'taxi-varga, request received',
            text: msgConfirm
        }
        
        const sendRequest = await this.wrapedSendMail(mailOptionsRequest, emailSender, emailPass);
        const confirmRequest = await this.wrapedSendMail(mailOptionsConfirm, emailSender, emailPass);
        
        return {response: {
            sendRequestTo: sendRequest,
            confirmedRequestFrom: confirmRequest,
            sender: sender
        }};
    }

    async wrapedSendMail(mailOptions, emailSender, emailPass) {
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
                    user: emailSender,
                    pass: emailPass
                }
            });

            transporter.sendMail(mailOptions, function(error, info) {
                if(error) {
                    console.log("mail error: ", error);
                    reject(false);
                    if(error.responseCode === 535) {
                        throw new AuthenticationException('backend-auth-email');
                    } else {
                        throw new UnexpectedException('Unexpected error email');
                    }
                } else {
                    resolve(true);
                }
            })
        })
    }
}

module.exports = new MailingModel;