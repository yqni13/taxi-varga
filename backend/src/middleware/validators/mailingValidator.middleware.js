const { body } = require('express-validator');

exports.mailingSchema = [
    body('sender')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .isEmail()
        .withMessage('basic-invalid-email'),
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('body')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('confirm')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
]