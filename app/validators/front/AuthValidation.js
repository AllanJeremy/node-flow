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

exports.SignUpVerification = [
  check('verification_code')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage(validation.invalid_code)
    .bail(),
];

exports.EmailValidation = [
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
  check('verification_code')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage(validation.invalid_code)
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
    .custom((value,{req, loc, path}) => {
        if (value !== req.body.confirm_password) {
            throw new Error(validation.password_confirm_password_match);
        } else {
            return value;
        }
    })
    .bail(),
];