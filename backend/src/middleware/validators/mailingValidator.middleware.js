const { body } = require('express-validator');

exports.mailingSchema = [
    body('sender')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('body')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
]