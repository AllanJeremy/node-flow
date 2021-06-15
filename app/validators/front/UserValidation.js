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
    .optional({checkFalsy: true})
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


exports.visibility = [
  check('race_status')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.race_status_required)
    .bail(),
  check('gender_status')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.gender_status_required)
    .bail(),
  check('family_dynamic_status')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.family_dynamic_status_required)
    .bail(),
  check('sexual_orientation_status')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.sexual_orientation_status_required)
    .bail(),
  check('workouts_status')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.workouts_status_required)
    .bail(),
  check('health_categories_status')
    .optional({checkFalsy: true})
    .isArray({min: 1})
    .withMessage(validation.health_categories_status_required)
    .bail(),
];

exports.ChangePassword = [
  check('current_password')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.current_password_required)
    .bail(),
  check('new_password')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.new_password_required)
    .bail(),
];

exports.MatchingPreference = [
  check('module')
    .isArray({min: 1})
    .withMessage(validation.matching_preference_module_required)
    .bail(),
];



