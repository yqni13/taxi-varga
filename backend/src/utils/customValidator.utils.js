const { ServiceOption } = require('./enums/service-option.enum');
const { LanguageOption } = require('./enums/lang-option.enum');
const Utils = require('../utils/common.utils');
const { Config } = require('../configs/config');
const { decryptRSA } = require('../utils/crypto.utils');
const { InvalidPropertiesException } = require('../utils/exceptions/validation.exception');
const fs = require('fs');

exports.validateServiceOption = (value) => {
    const options = Object.values(ServiceOption);
    if(!options.includes(value)) {
        throw new Error('backend-service-option');
    }
    return true;
}

exports.validateLanguageCompatible = (language) => {
    const options = Object.values(LanguageOption);
    if(!options.includes(language)) {
        throw new Error('basic-invalid-language');
    }

    return true;
}

exports.validateDestinationServiceAddress = (address, addressDetails, compareDetails) => {
    if(addressDetails.province === 'Wien' && compareDetails.province === 'Wien') {
        throw new Error('backend-destination-vienna');
    }

    this.validatePlaceDetails(address, addressDetails)

    return true;
}

exports.validateAirportServiceAddress = (details, address) => {
    if(address === 'vie-schwechat') {
        return true;
    }

    this.validatePlaceDetails(address, details);

    if(!details.zipCode) {
        throw new Error('backend-missing-zipCode');
    }

    const postalCodesVienna = ['1010', '1020', '1030', '1040', '1050', '1060', '1070', '1080', '1090', '1100', '1110', '1120', '1130', '1140', '1150', '1160', '1170', '1180', '1190', '1200', '1210', '1220', '1230', '2333'];

    if(!postalCodesVienna.includes(details.zipCode)) {
        throw new Error('airport-invalid-place');
    }

    return true;
}

exports.validatePlaceDetails = (address, details) => {
    if(details === null || details === undefined || details.address !== Utils.formatRequestStringNoPlus(address)) {
        throw new Error('address-invalid-place');
    }

    return true;
}

exports.validateEncryptedSender = (encryptedSender) => {
    if(!Config.PRIVATE_KEY) {
        throw new AuthSecretNotFoundException('backend-404-key');
    }
    let privateKey;
    if(Config.MODE === 'development') {
        privateKey = fs.readFileSync(Config.PRIVATE_KEY, 'utf8');
    } else {
        privateKey = Config.PRIVATE_KEY;
    }

    const decryptedSender = decryptRSA(encryptedSender, privateKey);
    if(!decryptedSender.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        throw new InvalidPropertiesException('backend-invalid-email');
    }

    return true;
}