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
  check("sequence")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.sequence_required)
    .isNumeric()
    .withMessage(validationLanguage.sequence_number)
    .bail(),
  check("number_of_answer")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.number_of_answer_required)
    .isNumeric()
    .withMessage(validationLanguage.number_of_answer_number)
    .bail(),
  check("answer_label")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.answer_label_required)
    .bail(),
  check("question_icon")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.question_icon_required)
    .bail(),
  check("status")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validationLanguage.status_required)
    .bail(),
];
