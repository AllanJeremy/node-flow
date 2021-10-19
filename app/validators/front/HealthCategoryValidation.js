const { check, oneOf } = require("express-validator");

const language = require("../../language/en_default");
const validationLanguage = language.en.front.validation;

exports.Validation = oneOf([
  check("health_categories")
    .optional({ checkFalsy: true })
    .isArray({ min: 1 })
    .withMessage(validationLanguage.health_category_required)
    .bail(),
  check("other")
    .optional({ checkFalsy: true })
    .isArray({ min: 1 })
    .withMessage(validationLanguage.other_required)
    .bail(),
]);
