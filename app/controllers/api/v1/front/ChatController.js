const { validationResult } = require('express-validator');

/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

/**
 * Models
 */
const Models = require('../../../../models');
const MatchFeedback = Models.MatchFeedback;
const ChatModeration = Models.ChatModeration;
const Channel = Models.Channel;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;

/**
 * Transformers
 */
 var ChatTransformer = require('../../../../transformers/front/ChatTransformer');
 ChatTransformer = new ChatTransformer();


class ChatController {

  /**
   * @api {post} /chat/match_feedback/store Handle chat match feedback store operation
   * @apiName Front chat match feedback store
   * @apiGroup Front
   *
   * @apiParam {String} [question] question
   * @apiParam {Integer} [rating] rating
   * @apiParam {String} [description] description
   *
   * @apiSuccess (200) {Object}
   */
  Feedback = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    MatchFeedback.create({
      user_id: req.id,
      question: req.body.question,
      ratings: req.body.ratings,
      answer: req.body.answer,
      status: StatusHandler.active
    })
    .then(response => {
      return ResponseHandler.success(res, responseLanguage.feedback_store_success);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /chat/message/store Handle chat moderation message store operation
   * @apiName Front chat moderation message store
   * @apiGroup Front
   *
   * @apiParam {String} [message_id] message_id
   *
   * @apiSuccess (200) {Object}
   */
  Moderation = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    ChatModeration.create({
      message_id: req.body.message_id,
      status: StatusHandler.active
    })
    .then(response => {
      return ResponseHandler.success(res, responseLanguage.chat_message_store);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  Retention = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    Channel.findOne({
      where: {
        channel_id: req.body.channel_id
      }
    }).then(response => {
      if(!response) {
        Channel.create({
          channel_id: req.body.channel_id,
          message_retention: req.body.message_retention
        }).then(response => {
          return ResponseHandler.success(res, responseLanguage.message_retention_store);
        }).catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        Channel.update({
          message_retention: req.body.message_retention,
        }, {
          where: {
            channel_id: req.body.channel_id
          }
        }).then(response => {
          return ResponseHandler.success(res, responseLanguage.message_retention_update);
        }).catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      }
    }).catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });

  }

  /**
   * @api {get} /chat/message/retention/:channel_id Handle get chat retention message operation
   * @apiName Front get chat message retention
   * @apiGroup Front
   *
   * @apiSuccess (200) {Object}
   */
  GetRetention = (req, res) => {
    Channel.findOne({
      where: {
        channel_id: req.params.channel_id
      }
    }).then(response => {
      return ResponseHandler.success(res, '', ChatTransformer.transform(response));
    }).catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = ChatController;
