require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const { 
    AuthenticationException, 
    UnexpectedException 
} = require("../utils/exceptions/common.exception");
const { 
    AuthSecretNotFoundException,
    InvalidCredentialsException
} = require('../utils/exceptions/auth.exception');
const { Config } = require('../configs/config');
const { encryptRSA, decryptRSA, decryptAES } = require('../utils/crypto.utils');

class MailingModel {
    sendMail = async (params) => {
        if(!Object.keys(params).length) {
            return { error: 'no params found' };
        }

        const secrets = this.getValidMailSecrets();
        const encryptedBody = await decryptAES(params['body'], secrets.ivPosition);
        const sender = decryptRSA(params['sender'], secrets.privateKey);
        const subject = decryptRSA(params['subject'], secrets.privateKey);
        
        const content = this.createEmailContent(JSON.parse(encryptedBody));
        const msgRequest = content.msgRequest;
        const msgConfirm = content.msgConfirm;

        this.validateDecryptedSubject(subject);

        const mailOptionsRequest = {
            from: secrets.emailSender,
            to: 'lukas.varga@yqni13.com',
            // to: secrets.emailReceiver,
            subject: subject,
            text: msgRequest
        };

        const mailOptionsConfirm = {
            from: secrets.emailSender,
            to: sender,
            subject: 'taxi-varga, request received',
            text: msgConfirm
        }
        
        const sendRequest = await this.wrapedSendMail(mailOptionsRequest, secrets.emailSender, secrets.emailPass);
        const confirmRequest = await this.wrapedSendMail(mailOptionsConfirm, secrets.emailSender, secrets.emailPass);
        const encryptedSender = encryptRSA(sender, secrets.publicKey);

        return { 
            response: {
                sendRequestTo: sendRequest,
                confirmedRequestFrom: confirmRequest,
                sender: encryptedSender
            }
        };
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
                    console.log("mail info: ", info);
                    resolve(true);
                }
            })
        })
    }

    validateDecryptedSubject = (subject) => {
        if(subject !== 'Anfrage/Request: Taxi-Varga Service') {
            throw new InvalidCredentialsException('backend-invalid-subject');
        }
    }

    createEmailContent = (data) => {
        const divider = `
        ------------------
        ------------------
        `;
        const declareDE = 'Deutsche Version';
        const declareEN = 'English version';

        const bodyDE = this.configEmailBodyDE(data);
        const bodyEN = this.configEmailBodyEN(data);

        const confirmDE = this.configEmailConfirmDE(data);
        const confirmEN = this.configEmailConfirmEN(data);

        const msgRequest = `${declareDE}\n${bodyDE}\n\n${divider}\n\n${declareEN}\n${bodyEN}`;
        const msgConfirm = `\n${declareDE}\n${confirmDE}\n${divider}\n\n${declareEN}\n${confirmEN}`;

        return {
            msgRequest: msgRequest,
            msgConfirm: msgConfirm
        }
    }

    getValidMailSecrets = () => {
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

        const ivPosition = Config.IV_POSITION;
        if(!ivPosition) {
            throw new AuthSecretNotFoundException('backend-404-ivpos');
        }

        if(!Config.PRIVATE_KEY) {
            throw new AuthSecretNotFoundException('backend-404-key');
        }
        let privateKey;
        if(Config.MODE === 'development') {
            privateKey = fs.readFileSync(Config.PRIVATE_KEY, 'utf8');
        } else {
            privateKey = Config.PRIVATE_KEY;
        }

        if(!Config.PUBLIC_KEY) {
            throw new AuthSecretNotFoundException('backend-404-key');
        }
        let publicKey;
        if(Config.MODE === 'development') {
            publicKey = fs.readFileSync(Config.PUBLIC_KEY, 'utf8');
        } else {
            publicKey = Config.PUBLIC_KEY;
        }

        return {
            emailSender: emailSender,
            emailReceiver: emailReceiver,
            emailPass: emailPass,
            publicKey: publicKey,
            privateKey: privateKey,
            ivPosition: ivPosition
        }
    }

    configEmailConfirmDE = (data) => {
        let introduction;
        if(data.gender === 'female') {
            introduction = data.title 
                ? `Sehr geehrte Frau ${data.title} ${data.lastName}!`
                : `Sehr geehrte Frau ${data.lastName}!`;
        } else {
            introduction = data.title 
                ? `Sehr geehrter Herr ${data.title} ${data.lastName}!`
                : `Sehr geehrter Herr ${data.lastName}!`;
        }

        return `\n${introduction}\nVielen Dank für Ihre Anfrage bei taxi-varga.\nWir werden uns sobald wie möglich bei Ihnen melden!\n\nBitte antworten Sie NICHT auf dieses automatische Mail.\n`
    }

    configEmailConfirmEN = (data) => {
        let introduction;
        if(data.gender === 'female') {
            introduction = data.title 
                ? `Dear ${data.title} ${data.lastName}!`
                : `Dear Madam ${data.lastName}!`;
        } else {
            introduction = data.title 
                ? `Dear ${data.title} ${data.lastName}!`
                : `Dear Mr. ${data.lastName}!`;
        }

        return `\n${introduction}\nThank you for your inquiry at taxi-varga.\nWe will get back to you as soon as possible!\n\nPlease DO NOT reply to this automatic mail.\n`
    }

    configEmailBodyDE = (data) => {
        const msgStart = `Anfrage für Service: ${data.serviceTranslateDE}`;

        const msgCustomer = `Daten zur Person:\n${data.genderTranslateDE} ${data.title ? data.title + ' ' : ''}${data.firstName} ${data.lastName}\n${data.phone}\n${data.email}\nPersönliche Notiz:\n${data.note ? '"' + data.note + '"' : '--'}`;

        const msgServiceBasic = `Daten zum Service:\nAbholadresse: ${data.originTranslateDE}\nZieladresse: ${data.destinationTranslateDE}\n${data.service === 'destination' && data.back2home ? 'Rückkehradresse: ' + data.originAddress + '\n' : ''}Datum der Abholung: ${data.pickupDATE}\nZeitpunkt der Abholung: ${data.pickupTIME} Uhr`;

        const msgServiceFixed = `Fahrtstrecke: ${data.distance} km\nFahrtdauer: ${data.duration} h\n${data.hasLatency ? 'Verrechnete Wartezeit: ' + data.latency + ' h\n' : ''}Preis: ${data.price},00 EUR`;

        const msgServiceFlatrate = `${data.dropOffDATE && data.pickupDATE !== data.dropOffDATE ? 'Datum der Ankunft: ' + data.dropOffDATE + '\n' : ''}Geschätzte Zeit der Ankunft: ${data.dropOffTIME} Uhr\nVerrechnete Mietdauer: ${data.tenancy} h\nGeschätzter Preis: ${data.price},00 EUR`;

        return `${msgStart}\n\n${msgCustomer}\n\n${msgServiceBasic}\n${data.service === 'flatrate' ? msgServiceFlatrate : msgServiceFixed}`;
    }

    configEmailBodyEN = (data) => {
        const msgStart = `Request for service: ${data.serviceTranslateEN}`;

        const msgCustomer = `Customer data:\n${data.genderTranslateEN} ${data.title ? data.title + ' ' : ''}${data.firstName} ${data.lastName}\n${data.phone}\n${data.email}\nCustomer note:\n${data.note ? '"' + data.note + '"' : '--'}`;

        const msgServiceBasic = `Service data:\nPickup address: ${data.originTranslateEN}\nDestination address: ${data.destinationTranslateEN}\n${data.service === 'destination' && data.back2home ? 'Return address: ' + data.originAddress + '\n' : ''}Date of pickup: ${data.pickupDATE}\nTime of pickup: ${data.pickupTimeEN}`;

        const msgServiceFixed = `Distance: ${data.distance} km\nDuration: ${data.duration} h\n${data.hasLatency ? 'Charged waiting time: ' + data.latency + ' h\n' : ''}Price: ${data.price},00 EUR`;

        const msgServiceFlatrate = `${data.dropOffDATE && data.pickupDATE !== data.dropOffDATE ? 'Date of dropoff: ' + data.dropOffDATE + '\n' : ''}Estimated time of dropoff: ${data.dropOffTIME ? data.dropOffTimeEN : ''}\nCharged tenancy: ${data.tenancy} h\nEstimated price: ${data.price},00 EUR`;

        return `${msgStart}\n\n${msgCustomer}\n\n${msgServiceBasic}\n${data.service === 'flatrate' ? msgServiceFlatrate : msgServiceFixed}`;
    }
}

module.exports = new MailingModel;