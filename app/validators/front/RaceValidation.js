const { check, oneOf } = require('express-validator');

const language = require('../../language/en_default');
const validationLanguage = language.en.front.validation

exports.Validation = oneOf([
  check('race')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.race_required)
    .bail(),
  check('others')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.others_required)
    .bail(),
]);