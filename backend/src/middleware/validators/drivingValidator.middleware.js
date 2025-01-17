const { body } = require('express-validator');

exports.drivingAirportSchema = [
    body('origin')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required'),
    body('destination')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
];

exports.drivingDestinationSchema = [
    body('origin')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required'),
    body('destination')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required'),
    body('back2home')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required'),
    body('latency')
        .isInt({max: 720})
        .withMessage('basic-invalid-number')
];

exports.drivingFlatrateSchema = [
    body('origin')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required'),
    body('destination')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required'),
    body('tenancy')
        .exists()
        .withMessage('basic-invalid-required')
        .bail()
        .isInt({ min: 30, max: 1440 })
        .withMessage('basic-invalid-tenancy')
];
