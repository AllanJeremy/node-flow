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
 * Race Controller
 */
var RaceController = require('../../../controllers/api/v1/admin/RaceController');
RaceController = new RaceController();


/**
 * Race Routes
 */
router.get(apiRoute.RACE_LIST.name, RaceController.list);

router.post(apiRoute.RACE_STORE.name, [CommonValidation.Validation], RaceController.store);

router.patch(apiRoute.RACE_UPDATE.name, [CommonValidation.Validation], RaceController.update);

router.delete(apiRoute.RACE_DELETE.name, RaceController.destroy);


module.exports = router;
