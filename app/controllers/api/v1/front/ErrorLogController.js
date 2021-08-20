/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

/**
 * Models
 */
const Pronouns = require('../../../../models/Pronouns');
const Models = require('../../../../models');
const ErrorLog = Models.ErrorLog;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;


class ErrorLogController {

  /**
   * @api {post} /api/error/log Store error in database
   * @apiName Front error store
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  create = (req, res) => {
    ErrorLog.create({
       user_id: req.id,
       error: req.body.error
    }).then(response => {
      return ResponseHandler.success(res, responseLanguage.error_log_store_success);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = ErrorLogController;
