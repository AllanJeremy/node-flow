var express = require('express');
var router = express.Router();

/**
 * Route Configs
 */
const routeConfig = require('../config');
const apiRoute = routeConfig.apiRoute;

/**
 * Common Controller
 */
var ChatController = require('../../../controllers/api/v1/front/ChatController');
ChatController = new ChatController();

/**
 * Validators
 */
const ChatValidation = require('../../../validators/front/ChatValidation');


/**
 * Chat Routes
 */

router.post(apiRoute.CHAT_FEEDBACK, ChatValidation.Feedback, ChatController.Feedback);

router.post(apiRoute.CHAT_MESSAGE, ChatValidation.Moderation, ChatController.Moderation);

router.post(apiRoute.CHAT_MESSAGE_RETENTION, ChatValidation.Retention, ChatController.Retention);

router.get(apiRoute.CHAT_GET_MESSAGE_RETENTION, ChatController.GetRetention);

router.post(apiRoute.STORE_CHAT_USER, ChatValidation.Retention, ChatController.storeUser);

router.post(apiRoute.UPDATE_CHAT_USER, ChatValidation.Retention, ChatController.updateUser);

module.exports = router;
