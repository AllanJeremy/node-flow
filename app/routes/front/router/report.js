var express = require('express');
var router = express.Router();

/**
 * Route Configs
 */
const routeConfig = require('../config');
const authRoute = routeConfig.authRoute;
const apiRoute = routeConfig.apiRoute;

/**
 * Validators
 */
const ReportValidation = require('../../../validators/front/ReportValidation');

/**
 * Report Controller
 */
var ReportController = require('../../../controllers/api/v1/front/ReportController');
ReportController = new ReportController();


/**
 * Report Routes
 */
router.get(authRoute.REPORTED_REASON, ReportController.reason);

router.post(apiRoute.USER_REPORTED, [ReportValidation.Validation], ReportController.store);

module.exports = router;
