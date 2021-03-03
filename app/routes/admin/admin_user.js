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
const UserValidation = require('../../../validators/admin/UserValidation');

/**
 * Middlewares
 */
const { VerifyApiToken } = require('../../../middleware');
const { HasPermission } = require('../../../middleware');

/**
 * Admin User Controller
 */
var AdminUserController = require('../../../controllers/api/v1/admin/AdminUserController');
AdminUserController = new AdminUserController();


router.get(apiRoute.ADMIN_USER_LIST.name, [VerifyApiToken, HasPermission], AdminUserController.list);

router.post(apiRoute.ADMIN_USER_STORE.name, [VerifyApiToken, UserValidation.SignUp], AdminUserController.store);

router.post(apiRoute.ADMIN_USER_UPDATE.name, [VerifyApiToken, UserValidation.SignUp], AdminUserController.update);

router.delete(apiRoute.ADMIN_USER_DELETE.name, [VerifyApiToken, HasPermission], AdminUserController.destroy);


module.exports = router;

