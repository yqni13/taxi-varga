const { body } = require('express-validator');

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
        .custom((value) => validateLanguageCompatible(value))
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
        .custom((value) => validateLanguageCompatible(value))
]

const validateLanguageCompatible = (language) => {
    const langArray = [
        "de",
        "en"
    ];

    if(!langArray.includes(language)) {
        throw new Error('basic-invalid-language');
    }

    return true;
}