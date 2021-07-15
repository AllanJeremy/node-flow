require('dotenv').config();
const { validationResult } = require('express-validator');

var {StreamChat} = require('stream-chat');

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

    const serverClient = StreamChat.getInstance( process.env.GET_STREAM_API_KEY, process.env.GET_STREAM_API_SECRET);

    serverClient.channel('messaging', 'awesome-chat', {
      name: 'Founder Chat',
      members: ['123joynapp', '124joynapp', 'nick'],
      invites: ['123joynapp'],
  });
    if (req.params.code) {
      switch (req.params.code) {
        case en:
          return ResponseHandler.success(res, '', en);
          break;
        default:
          return ResponseHandler.success(res, '', en);
          break;
      }
    } else {
      return ResponseHandler.success(res, '', en);
    }
  }

}

module.exports = LanguageController;
