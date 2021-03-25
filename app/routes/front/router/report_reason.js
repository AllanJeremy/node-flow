var express = require('express');
var router = express.Router();

/**
 * Route Configs
 */
const routeConfig = require('../config');
const authRoute = routeConfig.authRoute;


/**
 * Report Reason Controller
 */
var ReportReasonController = require('../../../controllers/api/v1/front/ReportReasonController');
ReportReasonController = new ReportReasonController();


/**
 * Report Reason Routes
 */
router.get(authRoute.REPORTED_REASON, ReportReasonController.list);

module.exports = router;
