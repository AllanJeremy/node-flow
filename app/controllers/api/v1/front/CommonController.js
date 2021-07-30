const { validationResult } = require('express-validator');
/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

const HealthJourney = require('../../../../helpers/HealthJourney');

/**
 * Models
 */
const Pronouns = require('../../../../models/Pronouns');
const Models = require('../../../../models');
const Avatar = Models.Avatar;
const ContactSupport = Models.ContactSupport;
const Feedback = Models.Feedback;
const UserHealthJourney = Models.UserHealthJourney;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;

/**
 * Transformers
 */
 var AvatarTransformer = require('../../../../transformers/front/AvatarTransformer');
 AvatarTransformer = new AvatarTransformer();

class CommonController {

  /**
   * @api {get} /api/pronouns/list Show pronouns list
   * @apiName Front pronouns list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  pronouns = (req, res) => {
    var PronounsModel = new Pronouns();
    var pronouns = PronounsModel.pronouns;
    return ResponseHandler.success(res, '', pronouns);
  }

  /**
   * @api {get} /api/avatar/list Show avatar list
   * @apiName Front avatar list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
   avatar = (req, res) => {
    Avatar.findAll({
      where: {
        status: StatusHandler.active
      }
    , order: [['id', 'DESC']]})
    .then(response => {
      return ResponseHandler.success(res, '', AvatarTransformer.transform(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /api/contact_support/store Handle contact support detail store operation
   * @apiName Front contact support detail store
   * @apiGroup Front
   *
   * @apiParam {String} [email] email
   * @apiParam {String} [description] description
   *
   * @apiSuccess (200) {Object}
   */
   ContactSupport = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    ContactSupport.create({
      user_id: req.id,
      email: req.body.email,
      description: req.body.description
    })
    .then(response => {
      return ResponseHandler.success(res, responseLanguage.contact_support_store_success);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /api/feedback/store Handle feedback store operation
   * @apiName Front feedback store
   * @apiGroup Front
   *
   * @apiParam {String} [rating] rating
   * @apiParam {String} [suggestion] suggestion
   *
   * @apiSuccess (200) {Object}
   */
   Feedback = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    Feedback.create({
      user_id: req.id,
      rating: req.body.rating,
      suggestion: req.body.suggestion
    })
    .then(response => {
      return ResponseHandler.success(res, responseLanguage.feedback_store_success);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {get} /api/health_journey/list Show Health journey question list
   * @apiName Front journey question list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  HealthJourney = (req, res) => {
    var healthJourney = {
      question: HealthJourney.HealthJourneyQuestion,
      options: HealthJourney.HealthJourneyOption
    };
    return ResponseHandler.success(res, '', healthJourney);
  }


}

module.exports = CommonController;
