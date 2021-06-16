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
var CommonController = require('../../../controllers/api/v1/front/CommonController');
CommonController = new CommonController();

/**
 * Validators
 */
const CommonValidation = require('../../../validators/front/CommonValidation');



/**
 * Common Routes
 */
router.get(apiRoute.PRONOUNS, CommonController.pronouns);

router.get(apiRoute.AVATAR, CommonController.avatar);

router.post(apiRoute.CONTACT_SUPPORT, CommonValidation.ContactSupport, CommonController.ContactSupport);

router.post(apiRoute.FEEDBACK, CommonValidation.Feedback, CommonController.Feedback);

module.exports = router;
