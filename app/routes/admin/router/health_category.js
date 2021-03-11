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
router.get(apiRoute.HEALTH_CATEGORY_LIST.name, HealthCategoryController.list);

router.post(apiRoute.HEALTH_CATEGORY_STORE.name, [CommonValidation.Validation], HealthCategoryController.store);

router.patch(apiRoute.HEALTH_CATEGORY_UPDATE.name, [CommonValidation.Validation], HealthCategoryController.update);

router.delete(apiRoute.HEALTH_CATEGORY_DELETE.name, HealthCategoryController.destroy);

router.post(apiRoute.HEALTH_CATEGORY_MERGE.name, HealthCategoryController.merge);

module.exports = router;
