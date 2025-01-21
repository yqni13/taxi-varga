const { body } = require('express-validator');

exports.mailingSchema = [
    body('sender')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .bail()
        .isEmail()
        .withMessage('basic-invalid-email'),
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required'),
    body('body')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
]