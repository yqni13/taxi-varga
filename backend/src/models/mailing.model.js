const nodemailer = require('nodemailer');
const { 
    AuthenticationException,
    RequestExceedMaxException,
    UnexpectedException 
} = require("../utils/exceptions/common.exception");
const { InvalidCredentialsException } = require('../utils/exceptions/auth.exception');
const { decryptRSA, decryptAES } = require('../utils/crypto.utils');
const Secrets = require('../utils/secrets.utils');
const { ServiceOption } = require('../utils/enums/service-option.enum');

class MailingModel {
    sendMail = async (params) => {
        if(!Object.keys(params).length) {
            return { error: 'no params found' };
        }

        const encryptedBody = await decryptAES(params['body'], Secrets.IV_POSITION);
        const sender = decryptRSA(params['sender'], Secrets.PRIVATE_KEY);
        const subject = decryptRSA(params['subject'], Secrets.PRIVATE_KEY);
        
        const content = this.createEmailContent(JSON.parse(encryptedBody));
        const msgRequest = content.msgRequest;
        const msgConfirm = content.msgConfirm;

        this.validateDecryptedSubject(subject, Secrets.EMAIL_SUBJECT);

        const mailOptionsRequest = {
            from: Secrets.EMAIL_SENDER,
            to: Secrets.EMAIL_RECEIVER,
            replyTo: sender,
            subject: subject,
            text: msgRequest
        };

        const mailOptionsConfirm = {
            from: Secrets.EMAIL_SENDER,
            to: sender,
            subject: 'taxi-varga, request received',
            text: msgConfirm
        }
        
        const sendRequest = await this.wrapedSendMail(mailOptionsRequest, Secrets.EMAIL_SENDER, Secrets.EMAIL_PASS);
        const confirmRequest = await this.wrapedSendMail(mailOptionsConfirm, Secrets.EMAIL_SENDER, Secrets.EMAIL_PASS);
        const accessableSender = sender;
        // const encryptedSender = encryptRSA(sender, Secrets.PUBLIC_KEY);

        return { 
            response: {
                sendRequestTo: sendRequest,
                confirmedRequestFrom: confirmRequest,
                sender: accessableSender
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
                    } else if(error.responseCode === 450) {
                        throw new RequestExceedMaxException();
                    } else {
                        throw new UnexpectedException('Unexpected error email');
                    }
                } else {
                    resolve(true);
                }
            })
        })
    }

    validateDecryptedSubject = (subject, secretSubject) => {
        if(subject !== secretSubject) {
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

        const msgCustomer = `Daten zur Person\n${data.genderTranslateDE} ${data.title ? data.title + ' ' : ''}${data.firstName} ${data.lastName}\n${data.phone}\n${data.email}\nPersönliche Notiz: ${data.note ? '"' + data.note + '"' : '--'}`;

        const msgServiceBasic = `Daten zum Service\nAbholadresse: ${data.originTranslateDE}\nZieladresse: ${data.destinationTranslateDE}\n${data.service === 'destination' && data.back2home ? 'Rückkehradresse: ' + data.originAddress + '\n' : ''}Datum der Abholung: ${data.pickupDATE}\nZeitpunkt der Abholung: ${data.pickupTIME} Uhr`;

        const msgServiceFixed = `Fahrtstrecke: ${data.distance} km\nFahrtdauer: ${data.duration} h\n${data.hasLatency ? 'Pauschalierte Wartezeit: ' + data.latency + ' h\n' : ''}Preis: ${data.price},00 EUR`;

        let msgOutput;
        switch(data.service) {
            case(ServiceOption.FLATRATE): {
                const msgServiceFlatrate = `${data.dropOffDATE && data.pickupDATE !== data.dropOffDATE ? 'Datum der Ankunft: ' + data.dropOffDATE + '\n' : ''}Geschätzte Zeit der Ankunft: ${data.dropOffTIME} Uhr\nPauschalierte Mietdauer: ${data.tenancy} h\nGeschätzter Preis: ${data.price},00 EUR`;

                msgOutput = `${msgStart}\n\n${msgCustomer}\n\n${msgServiceBasic}\n${msgServiceFlatrate}`;
                break;
            }
            case(ServiceOption.GOLF): {
                const support = data.supportMode ? 'Mitspieler' : '';
                const newServiceBasic = `Daten zum Service:\nGewählte Anzahl Reisender: ${data.passengers}\nAbholadresse: ${data.originTranslateDE}\nGolfplatz: ${data.golfcourseTranslateDE}\nRückkehradresse: ${data.destinationTranslateDE}\nDatum der Abholung: ${data.pickupDATE}\nZeitpunkt der Abholung: ${data.pickupTIME} Uhr`;

                const msgServiceGolf = `${data.dropOffDATE && data.pickupDATE !== data.dropOffDATE ? 'Abfahrtsdatum der Rückfahrt: ' + data.dropOffDATE + '\n' : ''}Abfahrtszeit der Rückfahrt: ${data.dropOffTIME} Uhr\nGeplanter Aufenthalt: ${data.stay} h\n${data.supportMode ? 'Zusätzlich gewählter Service: ' + support + '\n' : ''}Geschätzter Preis: ${data.price},00 EUR`;

                msgOutput = `${msgStart}\n\n${msgCustomer}\n\n${newServiceBasic}\n${msgServiceGolf}`;
                break;
            }
            default: {
                msgOutput = `${msgStart}\n\n${msgCustomer}\n\n${msgServiceBasic}\n${msgServiceFixed}`;
            }
        }

        return msgOutput;
    }

    configEmailBodyEN = (data) => {
        const msgStart = `Request for service: ${data.serviceTranslateEN}`;

        const msgCustomer = `Customer data\n${data.genderTranslateEN} ${data.title ? data.title + ' ' : ''}${data.firstName} ${data.lastName}\n${data.phone}\n${data.email}\nCustomer note: ${data.note ? '"' + data.note + '"' : '--'}`;

        const msgServiceBasic = `Service data\nPickup address: ${data.originTranslateEN}\nDestination address: ${data.destinationTranslateEN}\n${data.service === 'destination' && data.back2home ? 'Return address: ' + data.originAddress + '\n' : ''}Date of pickup: ${data.pickupDATE}\nTime of pickup: ${data.pickupTimeEN}`;

        const msgServiceFixed = `Distance: ${data.distance} km\nDuration: ${data.duration} h\n${data.hasLatency ? 'Overall waiting time: ' + data.latency + ' h\n' : ''}Price: ${data.price},00 EUR`;

        let msgOutput;
        switch(data.service) {
            case(ServiceOption.FLATRATE): {
                const msgServiceFlatrate = `${data.dropOffDATE && data.pickupDATE !== data.dropOffDATE ? 'Date of dropoff: ' + data.dropOffDATE + '\n' : ''}Estimated time of dropoff: ${data.dropOffTIME ? data.dropOffTimeEN : ''}\nOverall tenancy: ${data.tenancy} h\nEstimated price: ${data.price},00 EUR`;

                msgOutput = `${msgStart}\n\n${msgCustomer}\n\n${msgServiceBasic}\n${msgServiceFlatrate}`;
                break;
            }
            case(ServiceOption.GOLF): {
                const support = data.supportMode ? 'Co-Player' : '';
                const newServiceBasic = `Service data:\nSelected number of passengers: ${data.passengers}\nPickup address: ${data.originTranslateEN}\nGolfcourse: ${data.golfcourseTranslateEN}\nReturn address: ${data.destinationTranslateEN}\nDate of pickup: ${data.pickupDATE}\nTime of pickup: ${data.pickupTimeEN}`;

                const msgServiceGolf = `${data.dropOffDATE && data.pickupDATE !== data.dropOffDATE ? 'Date of departure for return: ' + data.dropOffDATE + '\n' : ''}Time of departure for return: ${data.dropOffTIME ? data.dropOffTimeEN : ''}\nIntended time of stay: ${data.stay} h\n${data.supportMode ? 'Selected auxiliary service: ' + support + '\n' : ''}Estimated price: ${data.price},00 EUR`;

                msgOutput = `${msgStart}\n\n${msgCustomer}\n\n${newServiceBasic}\n${msgServiceGolf}`;
                break;
            }
            default: {
                msgOutput = `${msgStart}\n\n${msgCustomer}\n\n${msgServiceBasic}\n${msgServiceFixed}`;
            }
        }

        return msgOutput;
    }
}

module.exports = new MailingModel();