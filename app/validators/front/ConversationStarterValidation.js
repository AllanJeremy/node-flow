const { check } = require('express-validator');

const language = require('../../language/en_default');
const validationLanguage = language.en.front.validation

exports.Validation = [
  check('conversation_starter_id')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.conversation_starter_id_required)
    .bail(),
  check('answer')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.answer_required)
    .bail(),
];
