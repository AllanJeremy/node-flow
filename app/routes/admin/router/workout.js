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
router.get(apiRoute.WORKOUT_LIST.name, [VerifyApiToken, HasPermission], WorkoutController.list);

router.post(apiRoute.WORKOUT_STORE.name, [VerifyApiToken, HasPermission, CommonValidation.Validation], WorkoutController.store);

router.patch(apiRoute.WORKOUT_UPDATE.name, [VerifyApiToken, HasPermission, CommonValidation.Validation], WorkoutController.update);

router.delete(apiRoute.WORKOUT_DELETE.name, [VerifyApiToken], WorkoutController.destroy);


module.exports = router;
