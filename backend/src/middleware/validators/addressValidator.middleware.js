const { body } = require('express-validator');
const CustomValidator = require('../../utils/customValidator.utils');
const { AddressFilterOption } = require('../../utils/enums/addressfilter-option.enum');

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
        .custom((value) => CustomValidator.validateLanguageCompatible(value)),
    body('filter')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .custom((filter) => CustomValidator.validateEnum(filter, AddressFilterOption, 'addressFilter'))
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
