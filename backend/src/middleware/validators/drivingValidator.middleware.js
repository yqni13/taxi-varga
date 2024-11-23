const { body } = require('express-validator');
const { stateRegex, streetRegex } = require('../../utils/common.utils');
const { json } = require('body-parser');

exports.drivingDestinationSchema = [
    body('transport')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .bail()
        .equals('drive')
        .withMessage('driving-invalid-transport'),
    body('street')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .bail()
        .isLength({max: 50})
        .withMessage('driving-invalid-street-length'),
        // .matches(streetRegex)
        // .withMessage('driving-invalid-street-regex'),
    body('number')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required'),
    body('info')
        .optional()
        .trim(),
    body('zipCode')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .bail()
        .isLength({min: 4, max: 5})
        .withMessage('driving-invalid-zipCode'),
    body('city')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .bail()
        .isLength({max: 50})
        .withMessage('driving-invalid-city-length')
        .matches(stateRegex)
        .withMessage('driving-invalid-city-regex'),
    body('country')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .bail()
        .isLength({max: 50})
        .withMessage('driving-invalid-country-length')
        .matches(stateRegex)
        .withMessage('driving-invalid-country-regex'),
    body('date')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required'),
    body('time')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
];
// TODO(yqni13): add validation for time and date
exports.drivingFlatrateSchema = [
    body('passengers')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .bail()
        .isInt({min: 1})
        .withMessage('Must be an integer')
]

exports.drivingAirportSchema = [
    body('passengers')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .bail()
        .isInt({min: 1})
        .withMessage('driving-invalid-passengers-min')
]