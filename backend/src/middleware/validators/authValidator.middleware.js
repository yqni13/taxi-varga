const { body } = require('express-validator');
const CustomValidator = require('../../utils/customValidator.utils');

exports.authInitSessionSchema = [
    body('user')
        .trim()
        .notEmpty()
        .withMessage('backend-require'),
    body('pass')
        .trim()
        .notEmpty()
        .withMessage('backend-require'),
    body('aud')
        .trim()
        .notEmpty()
        .withMessage('backend-require')
        .bail()
        .custom((service) => CustomValidator.validateServiceOption(service))
];