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
const CommonValidation = require('../../../validators/admin/CommonValidation');

/**
 * Workout Controller
 */
var WorkoutController = require('../../../controllers/api/v1/admin/WorkoutController');
WorkoutController = new WorkoutController();

/**
 * Workout Routes
 */
router.get(apiRoute.WORKOUT.LIST, WorkoutController.list);

router.post(apiRoute.WORKOUT.STORE, [CommonValidation.Validation], WorkoutController.store);

router.patch(apiRoute.WORKOUT.UPDATE, [CommonValidation.Validation], WorkoutController.update);

router.delete(apiRoute.WORKOUT.DELETE, WorkoutController.destroy);

router.post(apiRoute.WORKOUT.MERGE, WorkoutController.merge);

module.exports = router;
