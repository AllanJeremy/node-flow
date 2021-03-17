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
router.get(apiRoute.USER_LIST.name, UserController.list);

router.get(apiRoute.USER_SHOW.name, UserController.show);

router.post(apiRoute.USER_UPDATE_STATUS.name, UserValidation.UserUpdateStatus, UserController.updateStatus);

module.exports = router;
