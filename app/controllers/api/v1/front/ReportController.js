require('dotenv').config();
const { validationResult } = require('express-validator');


/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

const ReportReasonHandler = require('../../../../helpers/ReportReasonHandler');

/**
 * Models
 */
const Models = require('../../../../models');
const ReportedUser = Models.ReportedUser;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;

/**
 * Transformers
 */
var ReportTransformer = require('../../../../transformers/front/ReportTransformer');
ReportTransformer = new ReportTransformer();

const ReportTypes = [
  'flagged',
  'reported'
];


class ReportController {

  /**
   * @api {get} /reported_reasons Show report reasons list
   * @apiName report reasons list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  reason = (req, res) => {
    let reasons = [];

    Object.entries(ReportReasonHandler).map((item, key) => {
      reasons.push({
        'key': item[0],
        'reason': item[1]
      })
    });

    return ResponseHandler.success(res, '', ReportTransformer.reason(reasons));
  }

  /**
   * @api {post} /user/reported Handles user report store operation
   * @apiName user report store operation
   * @apiGroup Front
   *
   * @apiParam {Integer} [user_id] user_id
   * @apiParam {String} [reason] reason
   *
   * @apiSuccess (200) {Object}
   */
  store = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    let allReasons = Object.keys(ReportReasonHandler);
    let reason = allReasons.indexOf(req.body.reason) > -1 ? ReportReasonHandler[req.body.reason] : req.body.reason;

    ReportedUser.create({
      user_id: req.body.user_id,
      reported_by: req.id,
      reason: reason,
      type: req.query.type && req.query.type == 'flagged' ?  ReportTypes[0] : ReportTypes[1],
      status: StatusHandler.pending
    })
    .then(response => {
      return ResponseHandler.success(
        res, responseLanguage.reported_successfully);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    })
  }



}

module.exports = ReportController;
