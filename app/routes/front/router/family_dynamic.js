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
 * Family dynamic Controller
 */
var FamilyDynamicController = require('../../../controllers/api/v1/front/FamilyDynamicController');
FamilyDynamicController = new FamilyDynamicController();


/**
 * Family dynamic Routes
 */
router.get(apiRoute.USER_PROFILE_FAMILY_DYNAMIC_LIST, FamilyDynamicController.list);

router.post(apiRoute.USER_PROFILE_FAMILY_DYNAMIC_STORE, CommonValidation.Validation, FamilyDynamicController.store);

module.exports = router;
