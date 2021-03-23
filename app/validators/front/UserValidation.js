const { check } = require('express-validator');

const language = require('../../language/en_default');
const validation = language.en.front.validation

exports.Profile = [
  check('first_name')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.first_name_required)
    .bail(),
  check('name_prefix')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.name_prefix_required)
    .bail(),
  check('birth_date')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.birth_date_required)
    .bail(),
  check('profile_picture')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.profile_picture_required)
    .bail(),
];

exports.ProfileSummary = [
  check('summary')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.summary_required)
    .bail(),
];

exports.UserInterest = [
  check('interest')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.user_interest_required)
    .bail(),
];
