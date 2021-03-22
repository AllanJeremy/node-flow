var express = require('express');
var router = express.Router();

/**
 * Route Configs
 */
const routeConfig = require('../config');
const apiRoute = routeConfig.apiRoute;

/**
 * Validators
 */
const ConversationStarterValidation = require('../../../validators/admin/ConversationStarterValidation');


/**
 * Conversation Starter Controller
 */
var ConversationStarterController = require('../../../controllers/api/v1/admin/ConversationStarterController');
ConversationStarterController = new ConversationStarterController();


/**
 * Conversation Starter Routes
 */
router.get(apiRoute.CONVERSATION_STARTER.LIST, ConversationStarterController.list);

router.post(apiRoute.CONVERSATION_STARTER.STORE, [ConversationStarterValidation.Validation], ConversationStarterController.store);

router.patch(apiRoute.CONVERSATION_STARTER.UPDATE, [ConversationStarterValidation.Validation], ConversationStarterController.update);

router.delete(apiRoute.CONVERSATION_STARTER.DELETE, ConversationStarterController.destroy);


module.exports = router;
