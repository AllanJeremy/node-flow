const { check } = require('express-validator');

const language = require('../../language/en_default');
const validation = language.en.front.validation

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
    .isLength({ min: 8 })
    .custom((value) => {
      return value.match(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/);
    })
    .withMessage(validation.password_alphanumeric)
    .bail(),
];

exports.ForgotPasswordRequest = [
  check('email')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.email_required)
    .isEmail()
    .withMessage(validation.email_invalid)
    .bail(),
];

exports.ForgotPassword = [
  check('password')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.password_required)
    .isLength({ min: 8 })
    .custom((value) => {
      return value.match(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/);
    })
    .withMessage(validation.password_alphanumeric)
    .bail(),
];
