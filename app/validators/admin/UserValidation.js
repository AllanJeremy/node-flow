const { check } = require('express-validator');

const language = require('../../language/en_default');
const validation = language.en.admin.validation;
const responseLanguage = language.en.admin.response;

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
    .optional({checkFalsy: true})
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.password_required)
    .isLength({ min: 8 })
    .withMessage(validation.password_minimum_length)
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

exports.AdminPermission = [
  check('permissions')
    .isArray({min: 1})
    .withMessage(validation.admin_permission_required)
    .bail()
];

exports.AuthToken = [
  check('access_token')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(responseLanguage.token_required)
    .bail()
];

exports.UserUpdateStatus = [
  check('status')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(responseLanguage.status_required)
    .bail()
];

