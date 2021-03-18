const { check } = require('express-validator');

const language = require('../../language/en_default');
const validationLanguage = language.en.admin.validation

exports.Validation = [
  check('question')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.question_required)
    .bail(),
  check('options')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.options_required)
    .bail(),
  check('options')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.sequence_required)
    .bail(),
  check('status')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.status_required)
    .bail(),
];
