const { check, oneOf } = require('express-validator');

const language = require('../../language/en_default');
const validationLanguage = language.en.front.validation

exports.Validation = oneOf([
  check('workouts')
    .optional({checkFalsy: true})
    .isArray({min: 1})
    .withMessage(validationLanguage.workout_required)
    .bail(),
  check('other')
    .optional({checkFalsy: true})
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.other_required)
    .bail(),
  check('status')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.workout_status_required)
    .bail(),
]);
