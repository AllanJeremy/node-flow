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
 * Admin User Controller
 */
var AdminUserController = require('../../../controllers/api/v1/admin/AdminUserController');
AdminUserController = new AdminUserController();


router.get(apiRoute.ADMIN_USER_LIST.name, AdminUserController.list);

router.post(apiRoute.ADMIN_USER_STORE.name, [UserValidation.SignUp], AdminUserController.store);

router.patch(apiRoute.ADMIN_USER_UPDATE.name, [UserValidation.SignUp], AdminUserController.update);

router.delete(apiRoute.ADMIN_USER_DELETE.name, AdminUserController.destroy);


module.exports = router;

