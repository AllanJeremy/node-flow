require('dotenv').config();

const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');
var { StreamChat } = require('stream-chat');

/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

const PeerStatusHandler = require('../../../../helpers/PeerStatusHandler');

var Chat = require('../../../../helpers/Chat');
Chat = new Chat();

/**
 * Constants
 */
const SystemConstants = require('../../../../config/constants.js');

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
const chatLanguage = language.en.chat;

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
    var chatToken = await Chat.token(user.unique_id);

    var botUser = await User.findOne({where: {
      email: SystemConstants.SYSTEM_BOT_EMAIL
    }});

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
      peer_id: botUser.id,
      status: PeerStatusHandler.active
    });

    try {
      const client = Chat.getInstance();

      var chatUser = await client.connectUser({
        id: user.unique_id,
        user_id: user.id,
        first_name: user.first_name,
        image: process.env.API_IMAGE_URL + '/avatar/' + user.profile_picture
      }, user.chat_token);

      await client.disconnectUser();

      var chatUser = await client.connectUser({
        id: botUser.unique_id,
        user_id: botUser.id,
        first_name: botUser.first_name,
        image: process.env.API_IMAGE_URL + '/avatar/' + botUser.profile_picture
      }, botUser.chat_token);

      const channel = client.channel('messaging', {
        members: [botUser.unique_id, user.unique_id]
      });

      await channel.create();

      const message = await channel.sendMessage({
        user_id: botUser.unique_id,
        text: 'Hi ' + user.first_name  + '! ' + chatLanguage.default_message,
        anotherCustomField: 'bot_user'
      });
      await client.disconnectUser();
    } catch(e) {}

    return ResponseHandler.success(res, '', responseLanguage.conversation_starter_status_store);
  }
}

module.exports = ConversationStarterController;
