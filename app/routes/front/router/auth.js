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


/**
 * Auth Routes
 */
router.post(authRoute.AUTH_LOGIN, AuthValidation.SignIn, AuthController.SignIn);

router.post(authRoute.AUTH_REGISTER, AuthValidation.SignUp, AuthController.SignUp);

router.post(authRoute.VERIFY_EMAIL, AuthValidation.SignUpVerification, AuthController.Verify);

router.post(authRoute.RESEND_CODE, AuthValidation.EmailValidation, AuthController.ResendCode);

router.post(authRoute.FORGOT_PASSWORD_REQUEST, AuthValidation.EmailValidation, AuthController.ForgotPasswordRequest);

router.post(authRoute.FORGOT_PASSWORD, AuthValidation.ForgotPassword, AuthController.ForgotPassword);

router.post(authRoute.REFRESH_TOKEN, AuthController.GetToken);

router.post(authRoute.AUTH_LINKEDIN, AuthValidation.LinkedinLogin, AuthController.LinkedinLogin);

module.exports = router;
