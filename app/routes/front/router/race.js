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
 * Race Controller
 */
var RaceController = require('../../../controllers/api/v1/front/RaceController');
RaceController = new RaceController();


/**
 * Race Routes
 */
router.get(apiRoute.PROFILE_RACE_LIST, RaceController.list);

router.post(apiRoute.PROFILE_RACE_STORE, CommonValidation.Validation, RaceController.store);

module.exports = router;
