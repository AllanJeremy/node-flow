var express = require('express');
var router = express.Router();
const multer = require('multer');

/**
 * Route Configs
 */
const routeConfig = require('../config');
const apiRoute = routeConfig.apiRoute;

/**
 * Validators
 */
const AvatarValidation = require('../../../validators/admin/AvatarValidation');

/**
 * Image Upload Middleware
 */
const imageMiddleware = require('../../../middleware/ImageUpload');


/**
 * Avatar Controller
 */
var AvatarController = require('../../../controllers/api/v1/admin/AvatarController');
AvatarController = new AvatarController();

/**
 * Avatar Routes
 */
router.get(apiRoute.AVATAR.LIST, AvatarController.list);

router.post(apiRoute.AVATAR.STORE, [multer({
    storage: imageMiddleware.image.storage(), 
    allowedImage:imageMiddleware.image.allowedImage 
    }).single('name'), AvatarValidation.Validation], AvatarController.store);

router.patch(apiRoute.AVATAR.UPDATE, [multer({
    storage: imageMiddleware.image.storage(), 
    allowedImage:imageMiddleware.image.allowedImage 
    }).single('name'), AvatarValidation.Validation], AvatarController.update);

router.delete(apiRoute.AVATAR.DELETE, AvatarController.destroy);


module.exports = router;
