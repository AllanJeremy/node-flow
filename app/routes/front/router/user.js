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
 * Profile Controller
 */
var ProfileController = require('../../../controllers/api/v1/front/ProfileController');
ProfileController = new ProfileController();


/**
 * Profile Routes
 */
router.post(apiRoute.PROFILE_BASIC, UserValidation.Profile, ProfileController.storeUserProfile);

module.exports = router;
