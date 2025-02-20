const { body } = require('express-validator');
const CustomValidator = require('../../utils/customValidator.utils');

exports.autocompleteSchema = [
    body('address')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('language')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .custom((value) => CustomValidator.validateLanguageCompatible(value))
];

exports.placeSchema = [
    body('placeId')
        .exists()
        .withMessage('backend-required'),
    body('language')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .custom((value) => CustomValidator.validateLanguageCompatible(value))
];
