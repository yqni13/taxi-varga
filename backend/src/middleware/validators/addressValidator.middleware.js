const { body } = require('express-validator');
const CustomValidator = require('../../utils/customValidator.utils');
const { AddressFilterOption } = require('../../utils/enums/addressfilter-option.enum');
const { LanguageOption } = require('../../utils/enums/lang-option.enum');

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
        .custom((value) => CustomValidator.validateEnum(value, LanguageOption, 'language')),
    body('sessionToken')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('filter')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .custom((filter) => CustomValidator.validateEnum(filter, AddressFilterOption, 'addressFilter'))
];

exports.placeSchema = [
    body('placeId')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('language')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .custom((value) => CustomValidator.validateEnum(value, LanguageOption, 'language')),
    body('sessionToken')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
];

exports.geocodeSchema = [
    body('latitude')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('longitude')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('language')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .custom((value) => CustomValidator.validateEnum(value, LanguageOption, 'language')),
];