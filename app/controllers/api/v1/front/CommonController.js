/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

/**
 * Models
 */
const Pronouns = require('../../../../models/Pronouns');

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


}

module.exports = CommonController;
