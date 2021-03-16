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
const Race = Models.Race;
const UserDetail = Models.UserDetail;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;

/**
 * Transformers
 */
var CommonTransformer = require('../../../../transformers/core/CommonTransformer');
CommonTransformer = new CommonTransformer();


class RaceController {

  /**
   * @api {post} /profile/race/list Show race list
   * @apiName Race list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    Race.findAll({
      where: {
        status: StatusHandler.active
      }
    , order: [['id', 'DESC']]})
    .then(response => {
      return ResponseHandler.success(res, '', CommonTransformer.transform(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {post} /profile/race/store Handles user profile race store operation
   * @apiName Front user profile race store operation
   * @apiGroup Front
   *
   * @apiParam {String} [name] name
   *
   * @apiSuccess (200) {Object}
   */
  store = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    Race.findOne({
      where: {
        name: req.body.name
      }
    }).then(response => {
      if (!response) {
        Race.create({
          name: req.body.name,
          status: StatusHandler.pending
        })
        .then(response => {
          this.updateUser(res, req.id, response.id);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        })
      } else {
        this.updateUser(res, req.id, response.id);
      }

    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  updateUser = (res, userId, raceId) => {
    UserDetail.findOne({
      where: {
        id: userId
      }
    }).then(response => {
      UserDetail.create({
        user_id: userId,
        race_id: raceId
      })
      .then(response => {
        return ResponseHandler.success(res, responseLanguage.profile_update);
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

module.exports = RaceController;
