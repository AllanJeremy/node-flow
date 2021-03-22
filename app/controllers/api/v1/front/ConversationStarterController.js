require('dotenv').config();
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
const ConversationStarter = Models.ConversationStarter;
const UserConversationStarter = Models.UserConversationStarter;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;

/**
 * Transformers
 */
var ConversationStarterTransformer = require('../../../../transformers/core/ConversationStarterTransformer');
ConversationStarterTransformer = new ConversationStarterTransformer();


class ConversationStarterController {

  /**
   * @api {get} /user/conversation_starter/list Show conversation starter list
   * @apiName Conversation starter question list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    ConversationStarter.findAll({
      where: {
        status: StatusHandler.active
      }
    , order: [['sequence', 'ASC']]})
    .then(response => {
      return ResponseHandler.success(res, '', ConversationStarterTransformer.transform(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {post} /user/conversation_starter/store Handles user conversation starter store operation
   * @apiName Front user Conversation starter question store operation
   * @apiGroup Front
   *
   * @apiParam {Integer} [conversation_starter_id] conversation_starter_id
   * @apiParam {String} [answer] answer
   *
   * @apiSuccess (200) {Object}
   */
  store = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    let conversationStarterAnswers = req.body.conversation_starter_answer;

    conversationStarterAnswers.map(async(item, index) => {
      let isConversationStarterExist = await UserConversationStarter.findOne({
        where: {
          user_id: req.id,
          conversation_starter_id: item.conversation_starter_id,
        }
      });
      if(!isConversationStarterExist) {
        await UserConversationStarter.create({
          user_id: req.id,
          conversation_starter_id: item.conversation_starter_id,
          answer: item.answer
        });
      } else {
        await UserConversationStarter.update({
          answer: item.answer
        },{
          where: {
            user_id: req.id,
            conversation_starter_id: item.conversation_starter_id,
          }
        });
      }
    });
    return ResponseHandler.success(res, responseLanguage.conversation_starter_store_success);
  }

}

module.exports = ConversationStarterController;
