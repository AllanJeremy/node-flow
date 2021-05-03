const { check } = require('express-validator');

const language = require('../../language/en_default');
const validationLanguage = language.en.admin.validation;

exports.Validation = [
  check('name')
    .optional({checkFalsy: true})
  	.trim()
    .escape()
    .not()
    .isObject()
    .withMessage(validationLanguage.name_required)
    .bail(),
  check('status')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.status_required)
    .bail(),
];