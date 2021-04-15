require('dotenv').config();
const { validationResult } = require('express-validator');


/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

/**
 * Languages
 */
const en = require('../../../../language/front/en_default');

class LanguageController {

  /**
   * @api {get} /app_label Show language labels
   * @apiName Label list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    if(req.params.lang_id) {
      switch(req.params.lang_id) {
        case en: 
          return ResponseHandler.success(res, en);
          break;
        default:
          return ResponseHandler.success(res, en);
          break;
      }
    } else {
      return ResponseHandler.success(res, en);
    }
  }

}

module.exports = LanguageController;
