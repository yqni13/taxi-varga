const { body } = require('express-validator');

exports.autocompleteSchema = [
    body('address')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required'),
    body('language')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .bail()
        .custom((value) =>{
            if(value !== 'de' && value !== 'en') {
                throw new Error();
            }
            return true;
        })
        .withMessage('basic-invalid-language')
];

exports.placeSchema = [
    body('token')
        .exists()
        .withMessage('basic-invalid-required'),
    body('language')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .bail()
        .custom((value) =>{
            if(value !== 'de' && value !== 'en') {
                throw new Error();
            }
        })
        .withMessage('basic-invalid-language')
]