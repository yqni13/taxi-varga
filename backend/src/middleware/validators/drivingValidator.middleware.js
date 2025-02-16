const { body } = require('express-validator');
const Utils = require('../../utils/common.utils');

exports.drivingAirportSchema = [
    body('origin')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('originDetails')
        .custom((value, { req }) => validateAirportServiceAddress(value, req.body.origin)),
    body('destination')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('destinationDetails')
        .custom((value, { req }) => validateAirportServiceAddress(value, req.body.destination))
];

exports.drivingDestinationSchema = [
    body('origin')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('originDetails')
        .custom((value, { req }) => validatePlaceDetails(req.body.origin, value)),
    body('destination')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('destinationDetails')
        .custom((value, { req }) => validatePlaceDetails(req.body.destination, value)),
    body('back2home')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('latency')
        .isInt({max: 720})
        .withMessage('basic-invalid-number')
];

exports.drivingFlatrateSchema = [
    body('origin')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('originDetails')
        .custom((value, { req }) => validatePlaceDetails(req.body.origin, value)),
    body('destination')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),    
    body('destinationDetails')
        .custom((value, { req }) => validatePlaceDetails(req.body.destination, value)),
    body('tenancy')
        .exists()
        .withMessage('backend-required')
        .bail()
        .isInt({ min: 30, max: 1440 })
        .withMessage('basic-invalid-tenancy')
];

const validateAirportServiceAddress = (details, address) => {
    if(address === 'vie-schwechat') {
        return true;
    }

    validatePlaceDetails(address, details);

    const postalCodesVienna = ['1010', '1020', '1030', '1040', '1050', '1060', '1070', '1080', '1090', '1100', '1110', '1120', '1130', '1140', '1150', '1160', '1170', '1180', '1190', '1200', '1210', '1220', '1230', '2333'];

    if(!postalCodesVienna.includes(details.zipCode)) {
        throw new Error('airport-invalid-place');
    }

    return true;
}

validatePlaceDetails = (address, details) => {
    if(details === null || details === undefined || details.address !== Utils.formatRequestStringNoPlus(address)) {
        throw new Error('address-invalid-place');
    }

    return true;
}