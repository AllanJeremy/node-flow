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
router.get(apiRoute.CONVERSATION_STARTER_LIST.name, ConversationStarterController.list);

router.post(apiRoute.CONVERSATION_STARTER_STORE.name, [ConversationStarterValidation.Validation], ConversationStarterController.store);

router.patch(apiRoute.CONVERSATION_STARTER_UPDATE.name, [ConversationStarterValidation.Validation], ConversationStarterController.update);

router.delete(apiRoute.CONVERSATION_STARTER_DELETE.name, ConversationStarterController.destroy);


module.exports = router;
