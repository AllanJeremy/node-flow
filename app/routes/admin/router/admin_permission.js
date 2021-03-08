var express = require('express');
var router = express.Router();

/**
 * Route Configs
 */
const routeConfig = require('../config');
const apiRoute = routeConfig.apiRoute;
const authRoute = routeConfig.authRoute;

/**
 * Validators
 */
const UserValidation = require('../../../validators/admin/UserValidation');

/**
 * Admin permission Controller
 */
var AdminPermissionController = require('../../../controllers/api/v1/admin/AdminPermissionController');
AdminPermissionController = new AdminPermissionController();

router.get(authRoute.ADMIN_PERMISSION_LIST, AdminPermissionController.permissionList);

router.get(authRoute.ADMIN_USER_PERMISSION_LIST, AdminPermissionController.list);

router.post(apiRoute.ADMIN_USER_PERMISSION_STORE.name, [UserValidation.AdminPermission], AdminPermissionController.store);


module.exports = router;

