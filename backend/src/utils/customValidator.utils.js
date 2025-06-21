const { ServiceOption } = require('./enums/service-option.enum');
const { LanguageOption } = require('./enums/lang-option.enum');
const Utils = require('../utils/common.utils');
const { decryptRSA } = require('../utils/crypto.utils');
const { InvalidPropertiesException } = require('../utils/exceptions/validation.exception');
const Secrets = require('./secrets.utils');
const { SupportModeOption } = require('./enums/supportmode-option.enum');
const { ErrorCodes } = require('./errorCodes.utils');

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
        throw new Error('backend-invalid-language');
    }

    return true;
}

exports.validateDestinationServiceAddress = (address, addressDetails, compareDetails) => {
    this.validatePlaceDetails(address, addressDetails)
    const location = ['Wien', 'Vienna'];
    if(location.includes(addressDetails.province) && location.includes(compareDetails.province)) {
        throw new Error('backend-destination-vienna');
    }
    return true;
}

exports.validateServiceRouteVIE = (req) => {
    const originZip = req.body.originDetails.zipCode;
    const destinZip = req.body.destinationDetails.zipCode;
    if((Utils.checkAddressAtViennaAirport(originZip) && Utils.checkAddressInVienna(destinZip))
    || (Utils.checkAddressAtViennaAirport(destinZip) && Utils.checkAddressInVienna(originZip))) {
        throw new Error('navigate-destination-airport/service');
    }

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

    if(!Utils.checkAddressInVienna(details.zipCode)) {
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
    const decryptedSender = decryptRSA(encryptedSender, Secrets.PRIVATE_KEY);
    if(!decryptedSender.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        throw new InvalidPropertiesException('backend-invalid-email');
    }

    return true;
}

exports.validateGolfSupportMode = (supportMode) => {
    const options = Object.values(SupportModeOption);
    if(!options.includes(supportMode)) {
        throw new Error('backend-invalid-supportmode');
    }

    return true;
}

exports.validateTravelTimeRelevance = (compareTime, travelTime, serviceOption) => {
    try {
        if(compareTime < travelTime) {
            throw new Error();
        }

        if(serviceOption === ServiceOption.GOLF) {
            return compareTime - travelTime
        }

        return true;
    } catch(err) {
        const msg = serviceOption === ServiceOption.GOLF
            ? 'backend-invalid-relevance-stay'
            : 'backend-invalid-relevance-travel';
        const flag = ErrorCodes.InvalidPropertiesException;
        throw new InvalidPropertiesException(msg, { flag: flag, data: [{msg: msg}] });
    }
}