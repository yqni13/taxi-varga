
const CustomValidator = require('../../utils/customValidator.utils');
const { body } = require('express-validator');

exports.drivingAirportSchema = [
    body('origin')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('originDetails')
        .custom((value, { req }) => CustomValidator.validateAirportServiceAddress(value, req.body.origin)),
    body('destination')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('destinationDetails')
        .custom((value, { req }) => CustomValidator.validateAirportServiceAddress(value, req.body.destination))
];

exports.drivingDestinationSchema = [
    body('origin')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('originDetails')
        .custom((details, { req }) => 
            CustomValidator.validateDestinationServiceAddress(req.body.origin, details, req.body.destinationDetails)
        ),
    body('destination')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('destinationDetails')
        .custom((details, { req }) => CustomValidator.validatePlaceDetails(req.body.destination, details)),
    body('back2home')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('latency')
        .isInt({max: 360})
        .withMessage('backend-invalid-latency'),
    body('pickupTIME')
        .isInt()
        .notEmpty()
        .withMessage('backend-required')
];

exports.drivingFlatrateSchema = [
    body('origin')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('originDetails')
        .custom((value, { req }) => CustomValidator.validatePlaceDetails(req.body.origin, value)),
    body('destination')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),    
    body('destinationDetails')
        .custom((value, { req }) => CustomValidator.validatePlaceDetails(req.body.destination, value)),
    body('tenancy')
        .exists()
        .withMessage('backend-required')
        .bail()
        .isInt({ max: 1440 }) //  x <= 24h
        .withMessage('backend-invalid-tenancy')
];


exports.drivingGolfSchema = [
    body('origin')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('originDetails')
        .custom((value, { req }) => CustomValidator.validatePlaceDetails(req.body.origin, value)),
    body('golfcourse')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),    
    body('golfcourseDetails')
        .custom((value, { req }) => CustomValidator.validatePlaceDetails(req.body.golfcourse, value)),
    body('destination')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),    
    body('destinationDetails')
        .custom((value, { req }) => CustomValidator.validatePlaceDetails(req.body.destination, value)),
    body('stay')
        .exists()
        .withMessage('backend-required')
        .bail()
        .isInt({ max: 4320 }) // x < 72h
        .withMessage('backend-invalid-stay'),
    body('supportMode')
        .exists()
        .withMessage('backend-required')
        .bail()
        .custom((value) => CustomValidator.validateGolfSupportMode(value))
];
