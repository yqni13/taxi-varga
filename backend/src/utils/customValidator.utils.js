const Utils = require('../utils/common.utils');
const { decryptRSA } = require('../utils/crypto.utils');
const { InvalidPropertiesException } = require('../utils/exceptions/validation.exception');
const Secrets = require('./secrets.utils');
const { ErrorCodes } = require('./errorCodes.utils');
const { ServiceOption } = require('./enums/service-option.enum');

exports.validateEnum = (value, enumObj, enumName) => {
    const enumValues = Object.values(enumObj);
    if(!enumValues.includes(value)) {
        throw new Error(`backend-invalid-entry#${enumName}`);
    }
    return true;
}

exports.validateDestinationServiceAddress = (address, addressDetails, compareDetails) => {
    this.validatePlaceDetails(address, addressDetails)
    if(Utils.checkAddressInViennaByProvince(addressDetails.province)
    && Utils.checkAddressInViennaByProvince(compareDetails.province)) {
        throw new Error('backend-destination-vienna');
    }

    return true;
}

exports.validateServiceRouteVIE = (req) => {
    const originZip = req.body.originDetails.zipCode;
    const destinZip = req.body.destinationDetails.zipCode;
    if((Utils.checkAddressAtViennaAirport(originZip) && Utils.checkAddressInViennaByZipCode(destinZip))
    || (Utils.checkAddressAtViennaAirport(destinZip) && Utils.checkAddressInViennaByZipCode(originZip))) {
        throw new Error('navigate-destination-airport/service');
    }

    return true;
}

exports.validateAirportServiceAddress = (details, address) => {
    if(address === 'vie-schwechat') {
        return true;
    }

    this.validatePlaceDetails(address, details);

    this.validateZipCodeExist(details);

    if(!Utils.checkAddressInViennaByZipCode(details.zipCode)) {
        throw new Error('airport-invalid-place');
    }

    return true;
}

exports.validateQuickOrigin = (address) => {
    if(!address.zipCode || (address.zipCode !== '2544' && !Utils.checkAddressInViennaByZipCode(address.zipCode))) {
        throw new Error('address-quick-invalid-origin');
    }

    return true;
}

exports.validatePlaceDetails = (address, details) => {
    // Address with '+' char comes with '#&&#' instead to hide before '+'-swap for empty spaces.
    let modifiedAddress = Utils.formatRequestStringNoPlus(address);
    modifiedAddress = modifiedAddress.replaceAll('#&&#', '+');
    if(details === null || details === undefined || details.address !== modifiedAddress) {
        throw new Error('address-invalid-place');
    }

    return true;
}

exports.validateZipCodeExist = (details) => {
    if(!details.zipCode) {
        throw new Error('backend-missing-zipCode');
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