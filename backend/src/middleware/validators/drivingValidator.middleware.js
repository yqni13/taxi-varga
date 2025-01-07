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
        .bail()
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
        .isInt({ min: 1, max: 24 })
        .withMessage('basic-invalid-tenancy')
];
