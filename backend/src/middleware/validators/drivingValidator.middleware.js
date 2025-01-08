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
        .withMessage('basic-invalid-required')
        .bail(),
    body('destination')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .bail(),
    body('back2home')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .bail(),
    body('latency')
        .isInt({max: 721}) // 12 hours * 60 minutes + 1 (does not compare equal to)
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
        .isInt({ min: 30, max: 1441 }) // 24 hours * 60 minutes + 1 (does not compare equal to)
        .withMessage('basic-invalid-tenancy')
];
