const { check } = require('express-validator');

const messages = require('../../langauge/en_default');
const validation = messages.ENLanguage.admin.validation

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
