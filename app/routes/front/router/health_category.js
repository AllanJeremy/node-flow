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
const HealthCategoryValidation = require('../../../validators/front/HealthCategoryValidation');

/**
 * Health Category Controller
 */
var HealthCategoryController = require('../../../controllers/api/v1/front/HealthCategoryController');
HealthCategoryController = new HealthCategoryController();


/**
 * Health Category Routes
 */
router.get(apiRoute.USER_PROFILE_HEALTH_CATEGORY_LIST, HealthCategoryController.list);

router.post(apiRoute.USER_PROFILE_HEALTH_CATEGORY_STORE, HealthCategoryValidation.Validation, HealthCategoryController.store);

module.exports = router;
