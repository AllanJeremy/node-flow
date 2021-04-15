var express = require('express');
var router = express.Router();

/**
 * Route Configs
 */
const routeConfig = require('../config');
const authRoute = routeConfig.authRoute;

/**
 * Language Controller
 */
var LanguageController = require('../../../controllers/api/v1/front/LanguageController');
LanguageController = new LanguageController();


/**
 * Language Routes
 */

router.get(authRoute.APP_LANGUAGE, LanguageController.list);


module.exports = router;
