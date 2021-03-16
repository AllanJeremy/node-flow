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
const PersonalityQuestionValidation = require('../../../validators/front/PersonalityQuestionValidation');

/**
 * Personality Question Controller
 */
var PersonalityQuestionController = require('../../../controllers/api/v1/front/PersonalityQuestionController');
PersonalityQuestionController = new PersonalityQuestionController();


/**
 * Personality Question Routes
 */
router.get(apiRoute.USER_PERSONALITY_QUESTION_LIST, PersonalityQuestionController.list);

router.post(apiRoute.USER_PERSONALITY_QUESTION_STORE, PersonalityQuestionValidation.Validation, PersonalityQuestionController.store);

module.exports = router;
