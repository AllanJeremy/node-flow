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
const GenderValidation = require('../../../validators/front/GenderValidation');

/**
 * Gender Controller
 */
var GenderController = require('../../../controllers/api/v1/front/GenderController');
GenderController = new GenderController();


/**
 * Gender Routes
 */
router.get(apiRoute.USER_PROFILE_GENDER_LIST, GenderController.list);

router.post(apiRoute.USER_PROFILE_GENDER_STORE, GenderValidation.Validation, GenderController.store);

module.exports = router;
