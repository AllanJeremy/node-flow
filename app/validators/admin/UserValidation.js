const { check } = require('express-validator');

const language = require('../../language/en_default');
const validation = language.en.admin.validation

exports.SignIn = [
  check('email')
  	.trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.email_required)
    .isEmail()
    .withMessage(validation.email_invalid)
    .bail(),
  check('password')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.password_required)
    .bail(),
];
