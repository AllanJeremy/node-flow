const { check, validationResult } = require('express-validator');

const auth = require('./auth');
const UserValidation = require('../../validators/admin/UserValidation'); 


var express = require('express');
var router = express.Router();


router.post('/auth/signin', UserValidation.SignIn, auth.SignIn);


module.exports = router