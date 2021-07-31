require('dotenv').config();
var {StreamChat} = require('stream-chat');
const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');
var {StreamChat} = require('stream-chat');

/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

const PeerStatusHandler = require('../../../../helpers/PeerStatusHandler');

var Chat = require('../../../../helpers/Chat');
Chat = new Chat();

const chatTokenPostfix = require('../../../../config/constants.js');

/**
 * Models
 */
const Models = require('../../../../models');
const ConversationStarter = Models.ConversationStarter;
const UserConversationStarter = Models.UserConversationStarter;
const User = Models.User;
const ListedPeer = Models.ListedPeer;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;

/**
 * Transformers
 */
var ConversationStarterTransformer = require('../../../../transformers/front/ConversationStarterTransformer');
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

    let isConversationStarterExist = await UserConversationStarter.findOne({
      where: {
        user_id: req.id
      }
    });
    if (!isConversationStarterExist) {
      await UserConversationStarter.create({
        user_id: req.id,
        conversation_starter_id: req.body.conversation_starter_id,
        answer: req.body.answer
      });
    } else {
      await UserConversationStarter.update({
        answer: req.body.answer,
        conversation_starter_id: req.body.conversation_starter_id,
      },{
        where: {
          user_id: req.id,
          conversation_starter_id: req.body.conversation_starter_id,
        }
      });
    }

    return ResponseHandler.success(res, responseLanguage.conversation_starter_store_success);
  }

  /**
   * @api {post} /user/conversation_starter/status/store Handles user conversation starter status store operation
   * @apiName Front user Conversation starter status store operation
   * @apiGroup Front
   *
   * @apiParam {Integer} [conversation_starter_id] conversation_starter_id
   *
   * @apiSuccess (200) {Object}
   */
  status = async(req, res) => {
    let isConversationStarterExist = await UserConversationStarter.findOne({
      where: {
        user_id: req.id,
        conversation_starter_id: req.body.conversation_starter_id,
      }
    });

    if (isConversationStarterExist) {
      await UserConversationStarter.update({
        status: StatusHandler.active
      },{
        where: {
          user_id: req.id,
          conversation_starter_id: req.body.conversation_starter_id,
        }
      });

      const Op = Sequelize.Op;
      UserConversationStarter.update({
        status: StatusHandler.pending
      }, {
        where: {
          conversation_starter_id: {[Op.notIn]: [req.body.conversation_starter_id]},
          user_id: req.id
        }
      });
    }

    var user = await User.findOne({where: { id: req.id }});
    var chatToken = await Chat.token(req.id + chatTokenPostfix.CHAT_TOKEN_POSTFIX);
    if(!user.published) {
      User.update({
        published: StatusHandler.active,
        chat_token: chatToken
      }, {
        where: {
          id: req.id
        }
      });
      ListedPeer.create({
        user_id: req.id,
        peer_id: 1,
        status: PeerStatusHandler.active
      });

      try {
          const serverClient = StreamChat.getInstance( process.env.GET_STREAM_API_KEY, process.env.GET_STREAM_API_SECRET);

          defaultUserId = 1;

          const channel = serverClient.channel('messaging', {
              members: [defaultUserId + chatTokenPostfix.CHAT_TOKEN_POSTFIX, req.id + chatTokenPostfix.CHAT_TOKEN_POSTFIX],
              created_by_id: defaultUserId + chatTokenPostfix.CHAT_TOKEN_POSTFIX
          });

          await channel.create();
          const message = await channel.sendMessage({
            user_id: defaultUserId + chatTokenPostfix.CHAT_TOKEN_POSTFIX,
            text: 'Hi ' + user.first_name  + '! Welcome! We are Larissa and Kendra, the founders of Joyn. We are so excited to be your first peer match as you connect with the community. Is there anything we can help you with?',
          });
      } catch(e) {
        // error in chat
      }
    }

    return ResponseHandler.success(res, '', responseLanguage.conversation_starter_status_store);
  }
}

module.exports = ConversationStarterController;
