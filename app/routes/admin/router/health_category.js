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
 * Health Category Controller
 */
var HealthCategoryController = require('../../../controllers/api/v1/admin/HealthCategoryController');
HealthCategoryController = new HealthCategoryController();

/**
 * Health Category Routes
 */
router.get(apiRoute.HEALTH_CATEGORY.LIST, HealthCategoryController.list);

router.post(apiRoute.HEALTH_CATEGORY.STORE, [CommonValidation.Validation], HealthCategoryController.store);

router.patch(apiRoute.HEALTH_CATEGORY.UPDATE, [CommonValidation.Validation], HealthCategoryController.update);

router.delete(apiRoute.HEALTH_CATEGORY.DELETE, HealthCategoryController.destroy);

router.post(apiRoute.HEALTH_CATEGORY.MERGE, HealthCategoryController.merge);

module.exports = router;
