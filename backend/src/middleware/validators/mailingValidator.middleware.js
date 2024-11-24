const { body } = require('express-validator');

exports.mailingSchema = [
    body('person')
        .trim()
        .notEmpty()
        .withMessage('basic-invalid-required')
        .bail()
        .isIn(["male", "female"])
        .withMessage('mailing-invalid-person-gender')
]