/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

/**
 * Models
 */
const Pronouns = require('../../../../models/Pronouns');
const Models = require('../../../../models');
const Avatar = Models.Avatar;

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


}

module.exports = CommonController;
