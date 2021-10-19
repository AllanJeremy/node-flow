const { check } = require("express-validator");

const language = require("../../language/en_default");
const validationLanguage = language.en.admin.validation;

exports.Validation = [
  check("question")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.question_required)
    .bail(),
  check("options")
    .isArray({ min: 1 })
    .withMessage(validationLanguage.options_required)
    .bail(),
  check("sequence")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.sequence_required)
    .isNumeric()
    .withMessage(validationLanguage.sequence_number)
    .bail(),
  check("status")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.status_required)
    .bail(),
];
