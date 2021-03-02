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
 * Health Category Controller
 */
var HealthCategoryController = require('../../../controllers/api/v1/admin/HealthCategoryController');
HealthCategoryController = new HealthCategoryController();

/**
 * Health Category Routes
 */
router.get(apiRoute.HEALTH_CATEGORY_LIST.name, [VerifyApiToken, HasPermission], HealthCategoryController.list);

router.post(apiRoute.HEALTH_CATEGORY_STORE.name, [VerifyApiToken, HasPermission, CommonValidation.Validation], HealthCategoryController.store);

router.patch(apiRoute.HEALTH_CATEGORY_UPDATE.name, [VerifyApiToken, HasPermission, CommonValidation.Validation], HealthCategoryController.update);

router.delete(apiRoute.HEALTH_CATEGORY_DELETE.name, [VerifyApiToken], HealthCategoryController.destroy);


module.exports = router;
