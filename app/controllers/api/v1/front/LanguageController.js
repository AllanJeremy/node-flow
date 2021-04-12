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
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;

const languageLabels = require('../../../../language/front/en_default');

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
    return ResponseHandler.success(res, languageLabels);
  }

}

module.exports = LanguageController;
