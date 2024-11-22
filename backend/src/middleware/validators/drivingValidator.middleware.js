const { body } = require('express-validator');
const { stateRegex, streetRegex } = require('../../utils/common.utils');

exports.calcDrivingSchema = [
    body('transport')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .equals('drive')
        .withMessage('driving-invalid-transport'),
    body('street')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
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
        .isLength({min: 4, max: 5})
        .withMessage('driving-invalid-zipCode'),
    body('city')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .isLength({max: 50})
        .withMessage('driving-invalid-city-length')
        .matches(stateRegex)
        .withMessage('driving-invalid-city-regex'),
    body('country')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
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