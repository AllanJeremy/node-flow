const { check, oneOf } = require('express-validator');

const language = require('../../language/en_default');
const validationLanguage = language.en.front.validation

exports.Validation = oneOf([
  check('races')
    .isArray({min: 1})
    .withMessage(validationLanguage.race_required)
    .bail(),
  check('other')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.other_required)
    .bail(),
  check('status')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.race_status_required)
    .bail(),
]);
