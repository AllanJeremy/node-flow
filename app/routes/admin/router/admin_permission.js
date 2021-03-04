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
 * Admin permission Controller
 */
var AdminPermissionController = require('../../../controllers/api/v1/admin/AdminPermissionController');
AdminPermissionController = new AdminPermissionController();

router.get(apiRoute.ADMIN_PERMISSION_LIST.name, AdminPermissionController.permissionList);

router.get(apiRoute.ADMIN_USER_PERMISSION_LIST.name, AdminPermissionController.list);

router.post(apiRoute.ADMIN_USER_PERMISSION_STORE.name, [UserValidation.AdminPermission], AdminPermissionController.store);


module.exports = router;

