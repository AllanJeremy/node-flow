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
 * User Profile Controller
 */
var UserProfileController = require('../../../controllers/api/v1/front/UserProfileController');
UserProfileController = new UserProfileController();


/**
 * User Profile Routes
 */
router.post(apiRoute.USER_PROFILE_BASIC, UserValidation.Profile, UserProfileController.store);

router.post(apiRoute.USER_PROFILE_BASIC_SUMMARY, UserValidation.ProfileSummary, UserProfileController.update);

router.post(apiRoute.USER_PROFILE_INTEREST, UserValidation.UserInterest, UserProfileController.userInterestStore);

router.post(apiRoute.USER_PROFILE_VISIBILITY, UserValidation.visibility, UserProfileController.visibility);

router.post(apiRoute.USER_CHANGE_PASSWORD, UserValidation.ChangePassword, UserProfileController.changePassword);

router.get(apiRoute.USER, UserProfileController.show);

module.exports = router;
