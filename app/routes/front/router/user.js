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
const UserValidation = require('../../../validators/front/UserValidation');

/**
 * Auth Controller
 */
var UserController = require('../../../controllers/api/v1/front/UserController');
UserController = new UserController();


router.post(apiRoute.PROFILE_BASIC, UserValidation.Profile, UserController.storeUserProfile);

module.exports = router;
