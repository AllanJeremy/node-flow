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
 * Middlewares
 */
const { VerifyApiToken } = require('../../../middleware');
const { HasPermission } = require('../../../middleware');

/**
 * Workout Controller
 */
var WorkoutController = require('../../../controllers/api/v1/admin/WorkoutController');
WorkoutController = new WorkoutController();

/**
 * Workout Routes
 */
router.get(apiRoute.WORKOUT_LIST.name, WorkoutController.list);

router.post(apiRoute.WORKOUT_STORE.name, [CommonValidation.Validation], WorkoutController.store);

router.patch(apiRoute.WORKOUT_UPDATE.name, [CommonValidation.Validation], WorkoutController.update);

router.delete(apiRoute.WORKOUT_DELETE.name, WorkoutController.destroy);

router.post(apiRoute.WORKOUT_MERGE.name, WorkoutController.merge);

module.exports = router;
