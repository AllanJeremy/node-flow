const { check, oneOf } = require('express-validator');

const language = require('../../language/en_default');
const validationLanguage = language.en.front.validation

exports.Validation = oneOf([
  check('gender')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.gender_required)
    .bail(),
  check('other')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.other_required)
    .bail(),
]);