var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator');

const { VerifyApiToken } = require('../../middleware');
const { HasPermission } = require('../../middleware');

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
const familyDynamic = require('./family_dynamic');

router.post('/auth/signin', UserValidation.SignIn, auth.SignIn);

router.get('/race/list', [VerifyApiToken, HasPermission], race.list);
router.post('/race/store', [VerifyApiToken, HasPermission, CommonValidation.Validation], race.store);
router.patch('/race/update/:id', [VerifyApiToken, HasPermission, CommonValidation.Validation], race.update);
router.delete('/race/delete/:id', [VerifyApiToken, HasPermission], race.destroy);

router.get('/gender/list', [VerifyApiToken, HasPermission], gender.list);
router.post('/gender/store', [VerifyApiToken, HasPermission, CommonValidation.Validation], gender.store);
router.patch('/gender/update/:id', [VerifyApiToken, HasPermission, CommonValidation.Validation], gender.update);
router.delete('/gender/delete/:id', [VerifyApiToken], gender.destroy);

router.get('/sexual_orientation/list', [VerifyApiToken, HasPermission], sexualOrientation.list);
router.post('/sexual_orientation/store', [VerifyApiToken, HasPermission, CommonValidation.Validation], sexualOrientation.store);
router.patch('/sexual_orientation/update/:id', [VerifyApiToken, HasPermission, CommonValidation.Validation], sexualOrientation.update);
router.delete('/sexual_orientation/delete/:id', [VerifyApiToken], sexualOrientation.destroy);

router.get('/workout/list', [VerifyApiToken, HasPermission], workout.list);
router.post('/workout/store', [VerifyApiToken, HasPermission, CommonValidation.Validation], workout.store);
router.patch('/workout/update/:id', [VerifyApiToken, HasPermission, CommonValidation.Validation], workout.update);
router.delete('/workout/delete/:id', [VerifyApiToken], workout.destroy);

router.get('/health_category/list', [VerifyApiToken, HasPermission], healthCategory.list);
router.post('/health_category/store', [VerifyApiToken, HasPermission, CommonValidation.Validation], healthCategory.store);
router.patch('/health_category/update/:id', [VerifyApiToken, HasPermission, CommonValidation.Validation], healthCategory.update);
router.delete('/health_category/delete/:id', [VerifyApiToken], healthCategory.destroy);

router.get('/family_dynamic/list', [VerifyApiToken, HasPermission], familyDynamic.list);
router.post('/family_dynamic/store', [VerifyApiToken, HasPermission, CommonValidation.Validation], familyDynamic.store);
router.patch('/family_dynamic/update/:id', [VerifyApiToken, HasPermission, CommonValidation.Validation], familyDynamic.update);
router.delete('/family_dynamic/delete/:id', [VerifyApiToken], familyDynamic.destroy);

module.exports = router
