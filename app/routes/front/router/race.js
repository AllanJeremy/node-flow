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
const RaceValidation = require('../../../validators/front/RaceValidation');

/**
 * Race Controller
 */
var RaceController = require('../../../controllers/api/v1/front/RaceController');
RaceController = new RaceController();


/**
 * Race Routes
 */
router.get(apiRoute.USER_PROFILE_RACE_LIST, RaceController.list);

router.post(apiRoute.USER_PROFILE_RACE_STORE, [RaceValidation.Validation], RaceController.store);

module.exports = router;
