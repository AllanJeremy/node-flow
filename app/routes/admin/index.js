var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator');

const {VerifyApiToken} = require('../../middleware');
const {CheckPermission} = require('../../middleware');

const auth = require('./auth');
const UserValidation = require('../../validators/admin/UserValidation');

const CommonValidation = require('../../validators/admin/CommonValidation');

const race = require('./race');
const gender = require('./gender');
const sexual_orientation = require('./sexual_orientation');
const workout = require('./workout');
const health_category = require('./health_category');


router.post('/auth/signin', UserValidation.SignIn, auth.SignIn);

router.get('/race', [VerifyApiToken, CheckPermission], race.list);
router.post('/race/store', [VerifyApiToken, CheckPermission, CommonValidation.Validation], race.store);
router.post('/race/edit/:id', [VerifyApiToken, CheckPermission, CommonValidation.Validation], race.update);
router.post('/race/delete/:id', [VerifyApiToken, CheckPermission], race.destroy);

router.get('/gender', [VerifyApiToken], gender.list);
router.post('/gender/store', [VerifyApiToken, CommonValidation.Validation], gender.store);
router.post('/gender/edit/:id', [VerifyApiToken, CommonValidation.Validation], gender.update);
router.post('/gender/delete/:id', [VerifyApiToken], gender.destroy);

router.get('/sexual_orientation', [VerifyApiToken], sexual_orientation.list);
router.post('/sexual_orientation/store', [VerifyApiToken, CommonValidation.Validation], sexual_orientation.store);
router.post('/sexual_orientation/edit/:id', [VerifyApiToken, CommonValidation.Validation], sexual_orientation.update);
router.post('/sexual_orientation/delete/:id', [VerifyApiToken], sexual_orientation.destroy);

router.get('/workout', [VerifyApiToken], workout.list);
router.post('/workout/store', [VerifyApiToken, CommonValidation.Validation], workout.store);
router.post('/workout/edit/:id', [VerifyApiToken, CommonValidation.Validation], workout.update);
router.post('/workout/delete/:id', [VerifyApiToken], workout.destroy);

router.get('/health_category', [VerifyApiToken], health_category.list);
router.post('/health_category/store', [VerifyApiToken, CommonValidation.Validation], health_category.store);
router.post('/health_category/edit/:id', [VerifyApiToken, CommonValidation.Validation], health_category.update);
router.post('/health_category/delete/:id', [VerifyApiToken], health_category.destroy);


module.exports = router
