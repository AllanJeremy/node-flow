var express = require('express');
var router = express.Router();

/**
 * Route Configs
 */
const routeConfig = require('../config');
const apiRoute = routeConfig.apiRoute;


/**
 * Report Controller
 */
var ReportController = require('../../../controllers/api/v1/admin/ReportController');
ReportController = new ReportController();


/**
 * Report Routes
 */
router.get(apiRoute.REPORTED_USER.LIST, ReportController.userList);

router.get(apiRoute.REPORTED_USER.NEW, ReportController.newUser);

router.patch(apiRoute.REPORTED_USER.READ, ReportController.status);

router.patch(apiRoute.REPORTED_USER.UNREAD, ReportController.status);

module.exports = router;
