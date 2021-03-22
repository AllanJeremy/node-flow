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
const SexualOrientationValidation = require('../../../validators/front/SexualOrientationValidation');

/**
 * Sexual Orientation Controller
 */
var SexualOrientationController = require('../../../controllers/api/v1/front/SexualOrientationController');
SexualOrientationController = new SexualOrientationController();

router.get(apiRoute.USER_PROFILE_SEXUAL_ORIENTATION_LIST, SexualOrientationController.list);

router.post(apiRoute.USER_PROFILE_SEXUAL_ORIENTATION_STORE, SexualOrientationValidation.Validation, SexualOrientationController.store);

module.exports = router;
