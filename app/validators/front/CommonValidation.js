const { check } = require('express-validator');

const language = require('../../language/en_default');
const validation = language.en.front.validation

exports.ContactSupport = [
  check('email')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.email_required)
    .isEmail()
    .withMessage(validation.email_invalid)
    .bail(),
  check('description')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.description_required)
    .bail(),
];


exports.Feedback = [
  check('rating')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.rating_required)
    .bail(),
  check('suggestion')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.suggestion_required)
    .bail(),
];
