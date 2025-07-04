const { body } = require('express-validator');
const CustomValidator = require('../../utils/customValidator.utils');
const { ServiceOption } = require('../../utils/enums/service-option.enum');

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
        .custom((value) => CustomValidator.validateEnum(value, ServiceOption, 'service'))
];