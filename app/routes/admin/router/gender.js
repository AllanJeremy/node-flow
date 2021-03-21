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
 * Gender Controller
 */
var GenderController = require('../../../controllers/api/v1/admin/GenderController');
GenderController = new GenderController();

/**
 * Gender Routes
 */
router.get(apiRoute.GENDER.LIST, GenderController.list);

router.post(apiRoute.GENDER.STORE, [CommonValidation.Validation], GenderController.store);

router.patch(apiRoute.GENDER.UPDATE, [CommonValidation.Validation], GenderController.update);

router.delete(apiRoute.GENDER.DELETE, GenderController.destroy);

router.post(apiRoute.GENDER.MERGE, GenderController.merge);

module.exports = router;
