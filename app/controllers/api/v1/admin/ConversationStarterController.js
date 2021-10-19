const { validationResult } = require("express-validator");

/**
 * Helpers
 */
var ResponseHandler = require("../../../../helpers/ResponseHandler");
ResponseHandler = new ResponseHandler();

/**
 * Models
 */
const Models = require("../../../../models");
const ConversationStarter = Models.ConversationStarter;

/**
 * Languages
 */
const language = require("../../../../language/en_default");
const responseLanguage = language.en.admin.response;
const validationLanguage = language.en.admin.validation;

/**
 * Transformers
 */
var ConversationStarterTransformer = require("../../../../transformers/admin/ConversationStarterTransformer");
ConversationStarterTransformer = new ConversationStarterTransformer();

class ConversationStarterController {
  /**
   * @api {get} /admin/conversation_starter/list Show conversation starter list
   * @apiName Conversation starter list
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    ConversationStarter.findAll({ order: [["id", "DESC"]] })
      .then((response) => {
        return ResponseHandler.success(
          res,
          "",
          ConversationStarterTransformer.transform(response)
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {post} /admin/conversation_starter/store Handles conversation starter store operation
   * @apiName Conversation starter store
   * @apiGroup Admin
   *
   * @apiParam {String} [question] question
   * @apiParam {String} [sequence] sequence
   * @apiParam {Integer} [number_of_answer] number_of_answer
   * @apiParam {JSON} [answer_label] answer_label
   * @apiParam {String} [question_icon] question_icon
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

    ConversationStarter.findOne({
      where: {
        question: req.body.question,
      },
    })
      .then((response) => {
        if (!response) {
          ConversationStarter.create({
            question: req.body.question,
            sequence: req.body.sequence,
            number_of_answer: req.body.number_of_answer,
            answer_label: req.body.answer_label,
            question_icon: req.name,
            status: req.body.status,
          })
            .then((response) => {
              return ResponseHandler.success(
                res,
                responseLanguage.conversation_starter_store_success,
                ConversationStarterTransformer.transform(response)
              );
            })
            .catch((err) => {
              return ResponseHandler.error(res, 500, err.message);
            });
        } else {
          return ResponseHandler.error(
            res,
            400,
            responseLanguage.conversation_starter_exist
          );
        }
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {patch} /admin/conversation_starter/update Handles conversation starter update operation
   * @apiName Conversation starter update
   * @apiGroup Admin
   *
   * @apiParam {String} [question] question
   * @apiParam {String} [sequence] sequence
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

    ConversationStarter.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((response) => {
        if (response) {
          ConversationStarter.update(
            {
              question: req.body.question,
              sequence: req.body.sequence,
              number_of_answer: req.body.number_of_answer,
              answer_label: req.body.answer_label,
              question_icon: req.name,
              status: req.body.status,
            },
            {
              where: { id: req.params.id },
              returning: true,
            }
          )
            .then((result) => {
              return ResponseHandler.success(
                res,
                responseLanguage.conversation_starter_update_success,
                ConversationStarterTransformer.transform(result)
              );
            })
            .catch((err) => {
              return ResponseHandler.error(res, 500, err.message);
            });
        } else {
          return ResponseHandler.error(
            res,
            400,
            responseLanguage.conversation_starter_exist
          );
        }
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {delete} /admin/conversation_starter/destroy Handles conversation starter destroy operation
   * @apiName Conversation starter destroy
   * @apiGroup Admin
   *
   * @apiParam {Integer} [id] id
   *
   * @apiSuccess (200) {Object}
   */
  destroy = (req, res) => {
    ConversationStarter.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((response) => {
        if (response) {
          ConversationStarter.destroy({ where: { id: req.params.id } })
            .then((response) => {
              fs.unlink(path.join("images/icon/" + name), function () {});
              return ResponseHandler.success(
                res,
                responseLanguage.conversation_starter_delete_success
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

module.exports = ConversationStarterController;
