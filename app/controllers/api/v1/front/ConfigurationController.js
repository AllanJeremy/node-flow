/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();


/**
 * Models
 */

const Models = require('../../../../models');
const Configuration = Models.Configuration;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;


class ConfigurationController {

  /**
   * @api {get} /api/config/name_from_database Get configuration value
   * @apiName Front configuration value
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    console.log("ttesttt", req.params.name)
    var name = req.params.name;
    Configuration.findOne({
      where: {
        name: name.toString()
      },
      logging: console.log

    }).then(response => {
      console.log("response", response);
      return ResponseHandler.success(res, '', response);
    }).catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }
}

module.exports = ConfigurationController;
