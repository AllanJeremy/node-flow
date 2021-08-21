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
var ErrorLogController = require('../../../controllers/api/v1/front/ErrorLogController');
ErrorLogController = new ErrorLogController();



/**
 * Chat Routes
 */

router.post(apiRoute.ERROR_LOG, [], ErrorLogController.create);

module.exports = router;
