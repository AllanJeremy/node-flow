const { validationResult } = require('express-validator');

/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

/**
 * Models
 */
const Models = require('../../../../models');
const PersonalityQuestion = Models.PersonalityQuestion;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.admin.response;
const validationLanguage = language.en.admin.validation;

/**
 * Transformers
 */
var PersonalityQuestionTransformer = require('../../../../transformers/admin/PersonalityQuestionTransformer');
PersonalityQuestionTransformer = new PersonalityQuestionTransformer();


class PersonalityQuestionController {

  /**
   * @api {post} /admin/personal_question/list Show personal question list
   * @apiName Personal question list
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    PersonalityQuestion.findAll({order: [['id', 'DESC']]})
    .then(response => {
      return ResponseHandler.success(res, '', PersonalityQuestionTransformer.transform(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {post} /admin/personal_question/store Handles personal question store operation
   * @apiName Personal question store
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
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    PersonalityQuestion.findOne({
      where: {
        question: req.body.question
      }
    }).then(response => {
      if (!response) {
        PersonalityQuestion.create({
          question: req.body.question,
          options: req.body.options,
          status: req.body.status
        })
        .then(response => {
          return ResponseHandler.success(
            res, responseLanguage.personality_question_store_success);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        })
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.personality_question_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /admin/personal_question/update Handles personal question update operation
   * @apiName Personal question update
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
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        PersonalityQuestion.update({
          name: req.body.name,
          status: req.body.status,
        },
        {
          where: { id: req.params.id },
          returning: true,
          plain: true
        })
        .then(result => {
          return ResponseHandler.success(
            res, responseLanguage.personality_question_update_success);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.not_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /admin/personal_question/destroy Handles personal question destroy operation
   * @apiName Personal question destroy
   * @apiGroup Admin
   *
   * @apiParam {Integer} [id] id
   *
   * @apiSuccess (200) {Object}
   */
  destroy = (req, res) => {
    PersonalityQuestion.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        PersonalityQuestion.destroy({ where: { id: req.params.id } })
        .then(response => {
          return ResponseHandler.success(res, responseLanguage.personality_question_delete_success);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.not_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = PersonalityQuestionController;
