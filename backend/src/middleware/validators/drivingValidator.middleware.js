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
        .isInt({max: 720})
        .withMessage('backend-invalid-latency')
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
        .isInt({ min: 30, max: 1440 })
        .withMessage('backend-invalid-tenancy')
];



