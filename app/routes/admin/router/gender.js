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
 * Gender Controller
 */
var GenderController = require('../../../controllers/api/v1/admin/GenderController');
GenderController = new GenderController();

/**
 * Gender Routes
 */
router.get(apiRoute.GENDER_LIST.name, [VerifyApiToken, HasPermission], GenderController.list);

router.post(apiRoute.GENDER_STORE.name, [VerifyApiToken, HasPermission, CommonValidation.Validation], GenderController.store);

router.patch(apiRoute.GENDER_UPDATE.name, [VerifyApiToken, HasPermission, CommonValidation.Validation], GenderController.update);

router.delete(apiRoute.GENDER_DELETE.name, [VerifyApiToken], GenderController.destroy);


module.exports = router;
