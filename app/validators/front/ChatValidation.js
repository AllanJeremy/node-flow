const { check } = require('express-validator');

const language = require('../../language/en_default');
const validation = language.en.front.validation


exports.Feedback = [
  check('question')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.feedback_question)
    .bail(),
  check('ratings')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.feedback_rating)
    .bail(),
  check('answer')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.feedback_answer)
    .bail(),
];

exports.Moderation = [
  check('message_id')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(validation.chat_message_id)
    .bail(),
];
