const { check } = require('express-validator');

const language = require('../../language/en_default');
const validationLanguage = language.en.front.validation

exports.Validation = [
  check('name')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.name_required)
    .bail(),
];


exports.ListValidation = [
  check('name')
    .isArray({min: 1})
    .withMessage(validationLanguage.name_required)
    .bail()
];
