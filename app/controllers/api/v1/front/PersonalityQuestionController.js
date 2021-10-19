require("dotenv").config();
const { validationResult } = require("express-validator");

/**
 * Helpers
 */
var ResponseHandler = require("../../../../helpers/ResponseHandler");
ResponseHandler = new ResponseHandler();

const StatusHandler = require("../../../../helpers/StatusHandler");

/**
 * Models
 */
const Models = require("../../../../models");
const PersonalityQuestion = Models.PersonalityQuestion;
const UserPersonalityQuestion = Models.UserPersonalityQuestion;

/**
 * Languages
 */
const language = require("../../../../language/en_default");
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;

/**
 * Transformers
 */
var PersonalityQuestionTransformer = require("../../../../transformers/core/PersonalityQuestionTransformer");
PersonalityQuestionTransformer = new PersonalityQuestionTransformer();

class PersonalityQuestionController {
  /**
   * @api {get} /user/profile/personality_question/list Show personality question list
   * @apiName Personality question list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    PersonalityQuestion.findAll({
      where: {
        status: StatusHandler.active,
      },
      order: [["sequence", "ASC"]],
    })
      .then((response) => {
        return ResponseHandler.success(
          res,
          "",
          PersonalityQuestionTransformer.transform(response)
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {post} /user/profile/personality_question/store Handles user profile personality question store operation
   * @apiName Front user profile personality question store operation
   * @apiGroup Front
   *
   * @apiParam {Integer} [question_id] question_id
   * @apiParam {Integer} [answer] answer
   *
   * @apiSuccess (200) {Object}
   */
  store = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(
        res,
        422,
        validationLanguage.required_fields,
        errors.array()
      );
    }

    let questionAnswers = req.body.question_answers;

    questionAnswers.map(async (item, index) => {
      let isQuestionExist = await UserPersonalityQuestion.findOne({
        where: {
          user_id: req.id,
          question_id: item.question_id,
        },
      });
      if (!isQuestionExist) {
        await UserPersonalityQuestion.create({
          user_id: req.id,
          question_id: item.question_id,
          answer: item.answer,
        });
      } else {
        await UserPersonalityQuestion.update(
          {
            answer: item.answer,
          },
          {
            where: {
              user_id: req.id,
              question_id: item.question_id,
            },
          }
        );
      }
    });
    return ResponseHandler.success(res, responseLanguage.profile_update);
  };
}

module.exports = PersonalityQuestionController;
