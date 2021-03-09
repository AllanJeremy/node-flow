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
const AuthValidation = require('../../../validators/front/AuthValidation');

/**
 * Auth Controller
 */
var AuthController = require('../../../controllers/api/v1/front/AuthController');
AuthController = new AuthController();


router.post(authRoute.AUTH_LOGIN, AuthValidation.SignIn, AuthController.SignIn);

router.post(authRoute.AUTH_REGISTER, AuthValidation.SignUp, AuthController.SignUp);

module.exports = router;
