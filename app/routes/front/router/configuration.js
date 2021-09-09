var express = require('express');
var router = express.Router();

/**
 * Route Configs
 */
const routeConfig = require('../config');
const authRoute = routeConfig.authRoute;


/**
 * Configuration Controller
 */
var ConfigurationController = require('../../../controllers/api/v1/front/ConfigurationController');
ConfigurationController = new ConfigurationController();


/**
 * Configuration Routes
 */
router.get(authRoute.CONFIG, ConfigurationController.list);

module.exports = router;
