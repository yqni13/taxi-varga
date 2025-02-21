const { body } = require('express-validator');
const CustomValidator = require('../../utils/customValidator.utils');

exports.mailingSchema = [
    body('sender')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
        .bail()
        .custom((encryptedSender) => CustomValidator.validateEncryptedSender(encryptedSender)),
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('backend-required'),
    body('body')
        .trim()
        .notEmpty()
        .withMessage('backend-required')
]