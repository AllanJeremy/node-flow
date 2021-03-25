const { check, oneOf } = require('express-validator');

const language = require('../../language/en_default');
const validationLanguage = language.en.front.validation

exports.Validation = oneOf([
  check('user_id')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.user_id_required)
    .bail(),
  check('reason')
  	.optional({checkFalsy: true})
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.reason_required)
    .bail()
]);