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
 * Personality Question Controller
 */
var PersonalityQuestionController = require('../../../controllers/api/v1/admin/PersonalityQuestionController');
PersonalityQuestionController = new PersonalityQuestionController();


/**
 * Personality Question Routes
 */
router.get(apiRoute.PERSONALITY_QUESTION.LIST, PersonalityQuestionController.list);

router.post(apiRoute.PERSONALITY_QUESTION.STORE, [PersonalityQuestionValidation.Validation], PersonalityQuestionController.store);

router.patch(apiRoute.PERSONALITY_QUESTION.UPDATE, [PersonalityQuestionValidation.Validation], PersonalityQuestionController.update);

router.delete(apiRoute.PERSONALITY_QUESTION.DELETE, PersonalityQuestionController.destroy);


module.exports = router;
