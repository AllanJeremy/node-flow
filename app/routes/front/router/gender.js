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
 * Gender Controller
 */
var GenderController = require('../../../controllers/api/v1/front/GenderController');
GenderController = new GenderController();


/**
 * Gender Routes
 */
router.get(apiRoute.PROFILE_GENDER_LIST, GenderController.list);

router.post(apiRoute.PROFILE_GENDER_STORE, CommonValidation.Validation, GenderController.store);

module.exports = router;
