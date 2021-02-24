const { check } = require('express-validator');

const language = require('../../language/en_default');
const validation = language.en.admin.validation

exports.Race = [
  check('name')
  	.trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.name_required)
    .bail(),
  check('status')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.status_required)
    .bail(),
];