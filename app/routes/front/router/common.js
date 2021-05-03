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
 * Common Routes
 */
router.get(apiRoute.PRONOUNS, CommonController.pronouns);

router.get(apiRoute.AVATAR, CommonController.avatar);

module.exports = router;