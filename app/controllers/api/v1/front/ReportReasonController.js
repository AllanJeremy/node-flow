require('dotenv').config();
const { validationResult } = require('express-validator');


/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const ReportReasonHandler = require('../../../../helpers/ReportReasonHandler');



/**
 * Transformers
 */
var CommonTransformer = require('../../../../transformers/core/CommonTransformer');
CommonTransformer = new CommonTransformer();


class ReportReasonController {

  /**
   * @api {get} /reported_reasons Show report reasons list
   * @apiName report reasons list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    let reasons = [];

    Object.entries(ReportReasonHandler).map((item, key) => {
      reasons.push({
        'key': item[0],
        'reason': item[1]
      })
    });

    return ResponseHandler.success(res, '', reasons);
  }

}

module.exports = ReportReasonController;
