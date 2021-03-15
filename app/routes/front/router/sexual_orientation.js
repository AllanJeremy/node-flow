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
const CommonValidation = require('../../../validators/front/CommonValidation');

/**
 * Sexual Orientation Controller
 */
var SexualOrientationController = require('../../../controllers/api/v1/front/SexualOrientationController');
SexualOrientationController = new SexualOrientationController();

router.get(apiRoute.PROFILE_SEXUAL_ORIENTATION_LIST, SexualOrientationController.list);

router.post(apiRoute.PROFILE_SEXUAL_ORIENTATION_STORE, CommonValidation.Validation, SexualOrientationController.store);

module.exports = router;
