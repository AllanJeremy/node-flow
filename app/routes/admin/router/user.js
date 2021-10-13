var express = require('express');
var router = express.Router();

/**
 * Route Configs
 */
const routeConfig = require('../config');
const apiRoute = routeConfig.apiRoute;

/**
 * Validators
 */
const UserValidation = require('../../../validators/admin/UserValidation');

/**
 * User Controller
 */
var UserController = require('../../../controllers/api/v1/admin/UserController');
UserController = new UserController();

/**
 * User Routes
 */
router.get(apiRoute.USER.LIST, UserController.list);

router.get(apiRoute.USER.SHOW, UserController.show);

router.post(apiRoute.USER.UPDATE_STATUS, UserValidation.UserUpdateStatus, UserController.updateStatus);

router.post(apiRoute.USER.LIST_STATUS, UserValidation.UserUpdateStatus, UserController.listStatus);

module.exports = router;
