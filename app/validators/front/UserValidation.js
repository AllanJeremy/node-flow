const { check } = require('express-validator');

const language = require('../../language/en_default');
const validation = language.en.front.validation

exports.Profile = [
  check('first_name')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.first_name)
    .bail(),
  check('name_prefix')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.name_prefix)
    .bail(),
  check('birth_date')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.birth_date)
    .bail(),
  check('profile_picture')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.profile_picture)
    .bail(),
];
