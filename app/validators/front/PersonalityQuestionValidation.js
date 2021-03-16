const { check } = require('express-validator');

const language = require('../../language/en_default');
const validationLanguage = language.en.admin.validation

exports.Validation = [
  check('question_answers')
    .isArray({min: 1})
    .withMessage(validationLanguage.question_answers_required)
    .bail()
];
