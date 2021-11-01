const { validationResult } = require("express-validator");

/**
 * Helpers
 */
const { ResponseHandler } = require("../../../../helpers");

/**
 * Models
 */
const { PersonalityQuestion } = require("../../../../models");

/**
 * Languages
 */
const language = require("../../../../language/en_default");
const responseLanguage = language.en.admin.response;
const validationLanguage = language.en.admin.validation;

/**
 * Transformers
 */
const {
  PersonalityQuestionTransformer,
} = require("../../../../transformers/core");

class PersonalityQuestionController {
  /**
   * @api {get} /admin/personality_question/list Show personal question list
   * @apiName Personality question list
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    PersonalityQuestion.findAll({
      order: [["id", "DESC"]],
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
   * @api {post} /admin/personality_question/store Handles personal question store operation
   * @apiName Personality question store
   * @apiGroup Admin
   *
   * @apiParam {String} [question] name
   * @apiParam {String} [options] name
   * @apiParam {String} [status] status
   *
   * @apiSuccess (200) {Object}
   */
  store = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(
        res,
        422,
        validationLanguage.required_fields,
        errors.array()
      );
    }

    PersonalityQuestion.findOne({
      where: {
        question: req.body.question,
      },
    })
      .then((response) => {
        if (!response) {
          PersonalityQuestion.create({
            question: req.body.question,
            options: req.body.options,
            sequence: req.body.sequence,
            status: req.body.status,
          })
            .then((response) => {
              return ResponseHandler.success(
                res,
                responseLanguage.personality_question_store_success
              );
            })
            .catch((err) => {
              return ResponseHandler.error(res, 500, err.message);
            });
        } else {
          return ResponseHandler.error(
            res,
            400,
            responseLanguage.personality_question_exist
          );
        }
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {patch} /admin/personality_question/update Handles personal question update operation
   * @apiName Personality question update
   * @apiGroup Admin
   *
   * @apiParam {String} [question] name
   * @apiParam {String} [options] name
   * @apiParam {String} [status] status
   * @apiParam {Integer} [id] id
   *
   * @apiSuccess (200) {Object}
   */
  update = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    PersonalityQuestion.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((response) => {
        if (response) {
          PersonalityQuestion.update(
            {
              question: req.body.question,
              options: req.body.options,
              sequence: req.body.sequence,
              status: req.body.status,
            },
            {
              where: { id: req.params.id },
              returning: true,
              plain: true,
            }
          )
            .then((result) => {
              return ResponseHandler.success(
                res,
                responseLanguage.personality_question_update_success
              );
            })
            .catch((err) => {
              return ResponseHandler.error(res, 500, err.message);
            });
        } else {
          return ResponseHandler.error(res, 400, responseLanguage.not_exist);
        }
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {delete} /admin/personality_question/destroy Handles personal question destroy operation
   * @apiName Personality question destroy
   * @apiGroup Admin
   *
   * @apiParam {Integer} [id] id
   *
   * @apiSuccess (200) {Object}
   */
  destroy = (req, res) => {
    PersonalityQuestion.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((response) => {
        if (response) {
          PersonalityQuestion.destroy({ where: { id: req.params.id } })
            .then((response) => {
              return ResponseHandler.success(
                res,
                responseLanguage.personality_question_delete_success
              );
            })
            .catch((err) => {
              return ResponseHandler.error(res, 500, err.message);
            });
        } else {
          return ResponseHandler.error(res, 400, responseLanguage.not_exist);
        }
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };
}

module.exports = PersonalityQuestionController;
