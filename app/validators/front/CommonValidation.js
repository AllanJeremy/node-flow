const { check } = require('express-validator');

const language = require('../../language/en_default');
const validationLanguage = language.en.admin.validation

exports.Validation = [
  check('name')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.name_required)
    .bail(),
];
