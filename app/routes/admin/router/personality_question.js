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
const PersonalityQuestionValidation = require('../../../validators/admin/PersonalityQuestionValidation');


/**
 * Race Controller
 */
var PersonalityQuestionController = require('../../../controllers/api/v1/admin/PersonalityQuestionController');
PersonalityQuestionController = new PersonalityQuestionController();


/**
 * Race Routes
 */
router.get(apiRoute.PERSONALITY_QUESTION_LIST.name, PersonalityQuestionController.list);

router.post(apiRoute.PERSONALITY_QUESTION_STORE.name, [PersonalityQuestionValidation.Validation], PersonalityQuestionController.store);

router.patch(apiRoute.PERSONALITY_QUESTION_UPDATE.name, [PersonalityQuestionValidation.Validation], PersonalityQuestionController.update);

router.delete(apiRoute.PERSONALITY_QUESTION_DELETE.name, PersonalityQuestionController.destroy);


module.exports = router;
