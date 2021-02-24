var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator');

const {VerifyApiToken} = require('../../middleware');

const auth = require('./auth');
const UserValidation = require('../../validators/admin/UserValidation'); 

const race = require('./race');
const RaceValidation = require('../../validators/admin/RaceValidation');


router.post('/auth/signin', UserValidation.SignIn, auth.SignIn);

router.get('/race', [VerifyApiToken], race.list);
router.post('/race/store', [VerifyApiToken, RaceValidation.Race], race.store);
router.post('/race/edit/:id', [VerifyApiToken, RaceValidation.Race], race.update);
router.post('/race/delete/:id', [VerifyApiToken], race.destroy);


module.exports = router