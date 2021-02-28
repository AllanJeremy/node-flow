var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator');

const { VerifyApiToken } = require('../../middleware');
const { CheckPermission } = require('../../middleware');

//Validators
const UserValidation = require('../../validators/admin/UserValidation');
const CommonValidation = require('../../validators/admin/CommonValidation');

// Routes
const auth = require('./auth');
const race = require('./race');
const gender = require('./gender');
const sexualOrientation = require('./sexual_orientation');
const workout = require('./workout');
const healthCategory = require('./health_category');

router.post('/auth/signin', UserValidation.SignIn, auth.SignIn);

router.get('/race/list', [VerifyApiToken, CheckPermission], race.list);
router.post('/race/store', [VerifyApiToken, CheckPermission, CommonValidation.Validation], race.store);
router.post('/race/update/:id', [VerifyApiToken, CheckPermission, CommonValidation.Validation], race.update);
router.post('/race/delete/:id', [VerifyApiToken, CheckPermission], race.destroy);

router.get('/gender/list', [VerifyApiToken], gender.list);
router.post('/gender/store', [VerifyApiToken, CommonValidation.Validation], gender.store);
router.patch('/gender/update/:id', [VerifyApiToken, CommonValidation.Validation], gender.update);
router.delete('/gender/delete/:id', [VerifyApiToken], gender.destroy);

router.get('/sexual_orientation/list', [VerifyApiToken], sexualOrientation.list);
router.post('/sexual_orientation/store', [VerifyApiToken, CommonValidation.Validation], sexualOrientation.store);
router.post('/sexual_orientation/update/:id', [VerifyApiToken, CommonValidation.Validation], sexualOrientation.update);
router.post('/sexual_orientation/delete/:id', [VerifyApiToken], sexualOrientation.destroy);

router.get('/workout/list', [VerifyApiToken], workout.list);
router.post('/workout/store', [VerifyApiToken, CommonValidation.Validation], workout.store);
router.post('/workout/update/:id', [VerifyApiToken, CommonValidation.Validation], workout.update);
router.post('/workout/delete/:id', [VerifyApiToken], workout.destroy);

router.get('/health_category/list', [VerifyApiToken], healthCategory.list);
router.post('/health_category/store', [VerifyApiToken, CommonValidation.Validation], healthCategory.store);
router.post('/health_category/update/:id', [VerifyApiToken, CommonValidation.Validation], healthCategory.update);
router.post('/health_category/delete/:id', [VerifyApiToken], healthCategory.destroy);

module.exports = router
