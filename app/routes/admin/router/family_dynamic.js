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
 * Family Dynamic Controller
 */
var FamilyDynamicController = require('../../../controllers/api/v1/admin/FamilyDynamicController');
FamilyDynamicController = new FamilyDynamicController();

/**
 * Family Dynamic Routes
 */
router.get(apiRoute.FAMILY_DYNAMIC_LIST.name, FamilyDynamicController.list);

router.post(apiRoute.FAMILY_DYNAMIC_STORE.name, [CommonValidation.Validation], FamilyDynamicController.store);

router.patch(apiRoute.FAMILY_DYNAMIC_UPDATE.name, [CommonValidation.Validation], FamilyDynamicController.update);

router.delete(apiRoute.FAMILY_DYNAMIC_DELETE.name, FamilyDynamicController.destroy);

router.post(apiRoute.FAMILY_DYNAMIC_MERGE.name, FamilyDynamicController.merge);

module.exports = router;
