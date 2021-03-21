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
 * Sexual Orientation Controller
 */
var SexualOrientationController = require('../../../controllers/api/v1/admin/SexualOrientationController');
SexualOrientationController = new SexualOrientationController();

/**
 * Sexual Orientation Routes
 */
router.get(apiRoute.SEXUAL_ORIENTATION.LIST, SexualOrientationController.list);

router.post(apiRoute.SEXUAL_ORIENTATION.STORE, [CommonValidation.Validation], SexualOrientationController.store);

router.patch(apiRoute.SEXUAL_ORIENTATION.UPDATE, [CommonValidation.Validation], SexualOrientationController.update);

router.delete(apiRoute.SEXUAL_ORIENTATION.DELETE, SexualOrientationController.destroy);

router.post(apiRoute.SEXUAL_ORIENTATION.MERGE, SexualOrientationController.merge);

module.exports = router;
