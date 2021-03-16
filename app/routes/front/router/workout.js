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
 * Workout Controller
 */
var WorkoutController = require('../../../controllers/api/v1/front/WorkoutController');
WorkoutController = new WorkoutController();


/**
 * Workout Routes
 */
router.get(apiRoute.USER_PROFILE_WORKOUT_LIST, WorkoutController.list);

router.post(apiRoute.USER_PROFILE_WORKOUT_STORE, CommonValidation.ListValidation, WorkoutController.store);

module.exports = router;
