const { check } = require('express-validator');

const language = require('../../language/en_default');
const validationLanguage = language.en.front.validation

exports.Validation = [
  check('conversation_starter_answer')
    .isArray({min: 1})
    .withMessage(validationLanguage.conversation_starter_answer_required)
    .bail()
];
