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
 * Race Controller
 */
var RaceController = require('../../../controllers/api/v1/admin/RaceController');
RaceController = new RaceController();


/**
 * Race Routes
 */
router.get(apiRoute.RACE.LIST, RaceController.list);

router.post(apiRoute.RACE.STORE, [CommonValidation.Validation], RaceController.store);

router.patch(apiRoute.RACE.UPDATE, [CommonValidation.Validation], RaceController.update);

router.delete(apiRoute.RACE.DELETE, RaceController.destroy);

router.post(apiRoute.RACE.MERGE, RaceController.merge);

module.exports = router;
