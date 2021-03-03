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


exports.SignUp = [
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
  check('first_name')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.first_name_required)
    .bail(),
  check('last_name')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.last_name_required)
    .bail(),
];

