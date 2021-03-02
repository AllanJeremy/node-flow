var express = require('express');
var router = express.Router();

/**
 * Route Configs
 */
const routeConfig = require('../config');
const authRoute = routeConfig.authRoute;

/**
 * Validators
 */
const UserValidation = require('../../../validators/admin/UserValidation');

/**
 * Auth Controller
 */
var AuthController = require('../../../controllers/api/v1/admin/AuthController');
AuthController = new AuthController();


router.post(authRoute.AUTH_LOGIN, UserValidation.SignIn, AuthController.SignIn);


module.exports = router;

