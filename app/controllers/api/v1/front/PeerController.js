require('dotenv').config();
const { validationResult } = require('express-validator');


/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

const PeerStatusHandler = require('../../../../helpers/PeerStatusHandler');

const ElasticsearchEventsAction = require('../../../../helpers/ElasticsearchEventsAction');

var ElasticsearchEventsHandler = require('../../../../helpers/ElasticsearchEventsHandler');
ElasticsearchEventsHandler = new ElasticsearchEventsHandler();


/**
 * Models
 */
const Models = require('../../../../models');
const ListedPeer = Models.ListedPeer;
const DelistedPeer = Models.DelistedPeer;
const User = Models.User;
const HealthCategory = Models.HealthCategory;
const UserHealthCategory = Models.UserHealthCategory;
const DeclinedPeer = Models.DeclinedPeer;


/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;


/**
 * Transformers
 */
var PeerTransformer = require('../../../../transformers/front/PeerTransformer');
PeerTransformer = new PeerTransformer();


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
  match = (req, res) => {

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
        peer_id: req.body.peer_id,
        status: PeerStatusHandler.active
      }
    })
    .then(response => {
      ListedPeer.findAll({
        where: {
          user_id: req.id
        },
        attributes: ['peer_id'],
        raw: true
      }).then(response => {
        let peers = response.map(item => item.peer_id);
        let data = {
          id: req.id,
          listed_peers: peers
        }
        ElasticsearchEventsHandler.store(ElasticsearchEventsAction.listedPeerUpdate, data);
      });
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
  unmatch = (req, res) => {

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

      DelistedPeer.findAll({
        where: {
          user_id: req.id
        },
        attributes: ['peer_id'],
        raw: true
      }).then(response => {
        let peers = response.map(item => item.peer_id);
        let data = {
          id: req.id,
          delisted_peers: peers
        }
        ElasticsearchEventsHandler.store(ElasticsearchEventsAction.delistedPeerUpdate, data);
      });

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


  /**
   * @api {get} /user/peer/list Handles show list of matched peers
   * @apiName Front show user's peer list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {

    let limit = 10;
    let page = req.query.page && req.query.page > 0 ? req.query.page - 1 : 0 ;
    console.log("reqqqq", req.query.type);
    ListedPeer.findAll({
      where: {
        user_id: req.id,
        status: req.query.type == 0 ? PeerStatusHandler.mute : PeerStatusHandler.active
      },
      include: [{
        model: User,
        attributes: ['id', 'first_name', 'profile_picture'],
        where: { status: StatusHandler.active },
        as: 'peer'
      }],
      offset: page * limit,
      limit: limit,
      logging: console.log
    })
    .then(response => {
      console.log("0000", response);
      return ResponseHandler.success(res, '', PeerTransformer.peer(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {post} /user/peer/mute Handles store mute peer
   * @apiName Front mute peer store operation
   * @apiGroup Front
   *
   * @apiParam {Integer} [peer_id] peer_id
   *
   * @apiSuccess (200) {Object}
   */
  mute = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    ListedPeer.findOne({
      where: {
        user_id: req.id,
        peer_id: req.body.peer_id,
      }
    })
    .then(response => {
      if (response) {
        ListedPeer.update({
          status: PeerStatusHandler.mute,
        },
        {
          where: {
            user_id: req.id,
            peer_id: req.body.peer_id
          },
          returning: true
        })
        .then(result => {
          return ResponseHandler.success(
            res, responseLanguage.mute_peer_store);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /user/peer/unmute Handles store unmute peer
   * @apiName Front unmute peer store operation
   * @apiGroup Front
   *
   * @apiParam {Integer} [peer_id] peer_id
   *
   * @apiSuccess (200) {Object}
   */
  unmute = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    ListedPeer.findOne({
      where: {
        user_id: req.id,
        peer_id: req.body.peer_id,
      }
    })
    .then(response => {
      if (response) {
        ListedPeer.update({
          status: PeerStatusHandler.active,
        },
        {
          where: {
            user_id: req.id,
            peer_id: req.body.peer_id
          },
          returning: true
        })
        .then(result => {
          return ResponseHandler.success(
            res, responseLanguage.unmute_peer_store);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {get} /user/peer/new_match/list Handles show list of new matched peers
   * @apiName Front show new matched peer list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  newMatch = (req, res) => {

    let limit = 10;
    let page = req.query.page && req.query.page > 0 ? req.query.page - 1 : 0 ;

    User.findAll({
      attributes: ['id', 'first_name', 'profile_picture'],
      include: [{ model: UserHealthCategory,
        attributes: ['id', 'status'],
        include: [{
            model: HealthCategory,
            attributes: ['id', 'name', 'status'],
            as: 'health_category',
          }],
        as: 'health_categories'
      }],
      offset: page * limit,
      limit: limit,
    })
    .then(response => {
      return ResponseHandler.success(res, '', PeerTransformer.newMatch(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /user/peer/search Handles show list of new matched peers
   * @apiName Front show new matched peer list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  search = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    User.findAll({
      where: {[Op.iLike]: `%${req.body.search_text}%`}
    })
    .then(response => {
      return ResponseHandler.success(res, '', PeerTransformer.peer(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /user/peer/declined Handles show list of new matched peers
   * @apiName Front show new matched peer list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  declined = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    DeclinedPeer.findOrCreate({
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
      return ResponseHandler.success(res, responseLanguage.peer_declined_store);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });

  }

}

module.exports = PeerController;
