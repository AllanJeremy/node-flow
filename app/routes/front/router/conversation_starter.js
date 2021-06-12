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
const ConversationStarterValidation = require('../../../validators/front/ConversationStarterValidation');

/**
 * Conversation Starter Controller
 */
var ConversationStarterController = require('../../../controllers/api/v1/front/ConversationStarterController');
ConversationStarterController = new ConversationStarterController();

/**
 * Conversation Starter Routes
 */
router.get(apiRoute.COVERSATION_STARTER__LIST, ConversationStarterController.list);

router.post(apiRoute.COVERSATION_STARTER_STORE, ConversationStarterValidation.Validation, ConversationStarterController.store);

router.post(apiRoute.COVERSATION_STARTER_STATUS_STORE, [], ConversationStarterController.status);

module.exports = router;
