require('dotenv').config();
const { validationResult } = require('express-validator');


/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');


/**
 * Models
 */
const Models = require('../../../../models');
const ListedPeer = Models.ListedPeer;
const DelistedPeer = Models.DelistedPeer;


/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;


class PeerController {


  /**
   * @api {post} /user/peer/match Handles storing matched peer id operation
   * @apiName Front user peer match store operation
   * @apiGroup Front
   *
   * @apiParam {Integer} [peer_id] peer_id
   *
   * @apiSuccess (200) {Object}
   */
  storePeerMatch = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    ListedPeer.findOrCreate({
      where: {
        user_id: req.id,
        peer_id: req.body.peer_id
      },
      defaults: { 
        user_id: req.id,
        peer_id: req.body.peer_id
      }
    })
    .then(response => {
      return ResponseHandler.success(res, responseLanguage.peer_match_store);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /user/peer/unmatch Handles storing unmatched peer id operation
   * @apiName Front user peer unmatch store operation
   * @apiGroup Front
   *
   * @apiParam {Integer} [peer_id] peer_id
   *
   * @apiSuccess (200) {Object}
   */
  storePeerUnMatch = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    DelistedPeer.findOrCreate({
      where: {
        user_id: req.id,
        peer_id: req.body.peer_id
      },
      defaults: { 
        user_id: req.id,
        peer_id: req.body.peer_id
      }
    })
    .then(response => {
      ListedPeer.destroy({
        where: {
          user_id: req.id,
          peer_id: req.body.peer_id
      }})
      .then(response => {
        return ResponseHandler.success(res, responseLanguage.peer_unmatch_store);
      })
      .catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      });
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = PeerController;
