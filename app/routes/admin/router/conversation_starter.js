var express = require('express');
var router = express.Router();
const multer = require('multer');

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
 * Image Upload Middleware
 */
const imageMiddleware = require('../../../middleware/ImageUpload');

/**
 * Conversation Starter Controller
 */
var ConversationStarterController = require('../../../controllers/api/v1/admin/ConversationStarterController');
ConversationStarterController = new ConversationStarterController();


/**
 * Conversation Starter Routes
 */
router.get(apiRoute.CONVERSATION_STARTER.LIST, ConversationStarterController.list);

router.post(apiRoute.CONVERSATION_STARTER.STORE, [multer({
    storage: imageMiddleware.image.storage(),
    allowedImage:imageMiddleware.image.allowedImage
    }).single('question_icon'), ConversationStarterValidation.Validation], ConversationStarterController.store);

router.patch(apiRoute.CONVERSATION_STARTER.UPDATE, [multer({
    storage: imageMiddleware.image.storage(),
    allowedImage:imageMiddleware.image.allowedImage
    }).single('question_icon'), ConversationStarterValidation.Validation], ConversationStarterController.update);

router.delete(apiRoute.CONVERSATION_STARTER.DELETE, ConversationStarterController.destroy);


module.exports = router;
