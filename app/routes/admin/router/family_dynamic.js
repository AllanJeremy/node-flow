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
 * Family Dynamic Controller
 */
var FamilyDynamicController = require('../../../controllers/api/v1/admin/FamilyDynamicController');
FamilyDynamicController = new FamilyDynamicController();

/**
 * Family Dynamic Routes
 */
router.get(apiRoute.FAMILY_DYNAMIC.LIST, FamilyDynamicController.list);

router.post(apiRoute.FAMILY_DYNAMIC.STORE, [CommonValidation.Validation], FamilyDynamicController.store);

router.patch(apiRoute.FAMILY_DYNAMIC.UPDATE, [CommonValidation.Validation], FamilyDynamicController.update);

router.delete(apiRoute.FAMILY_DYNAMIC.DELETE, FamilyDynamicController.destroy);

router.post(apiRoute.FAMILY_DYNAMIC.MERGE, FamilyDynamicController.merge);

module.exports = router;
