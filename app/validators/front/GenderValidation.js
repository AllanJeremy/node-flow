const { check, oneOf } = require("express-validator");

const language = require("../../language/en_default");
const validationLanguage = language.en.front.validation;

exports.Validation = [
  check("gender")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.gender_required)
    .bail(),
  check("other")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.other_required)
    .bail(),
  check("status")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.gender_status_required)
    .bail(),
];
