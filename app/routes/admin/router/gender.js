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
router.get(apiRoute.GENDER_LIST.name, GenderController.list);

router.post(apiRoute.GENDER_STORE.name, [CommonValidation.Validation], GenderController.store);

router.patch(apiRoute.GENDER_UPDATE.name, [CommonValidation.Validation], GenderController.update);

router.delete(apiRoute.GENDER_DELETE.name, GenderController.destroy);

router.post(apiRoute.GENDER_MERGE.name, GenderController.merge);

module.exports = router;
