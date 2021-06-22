const { check, oneOf } = require('express-validator');

const language = require('../../language/en_default');
const validationLanguage = language.en.front.validation

exports.Validation = [
  check('peer_id')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.peer_id_required)
    .bail()
];

exports.Search = [
  check('search_text')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.search_input_required)
    .bail()
];
