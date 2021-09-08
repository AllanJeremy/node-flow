var express = require('express');
var router = express.Router();

/**
 * Route Configs
 */
const routeConfig = require('../config');
const apiRoute = routeConfig.apiRoute;
const authRoute = routeConfig.authRoute;

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

router.get(apiRoute.HEALTH_JOURNEY_LIST, CommonController.HealthJourney);

router.get(authRoute.PUBLIC_DOMAIN_LIST, CommonController.GetPublicDomain);

module.exports = router;
