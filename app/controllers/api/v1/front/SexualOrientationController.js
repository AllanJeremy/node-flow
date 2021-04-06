require('dotenv').config();
const { validationResult } = require('express-validator');


/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

const ElasticsearchEventsAction = require('../../../../helpers/ElasticsearchEventsAction');

var ElasticsearchEventsHandler = require('../../../../helpers/ElasticsearchEventsHandler');
ElasticsearchEventsHandler = new ElasticsearchEventsHandler();


/**
 * Models
 */
const Models = require('../../../../models');
const SexualOrientation = Models.SexualOrientation;
const UserMetadata = Models.UserMetadata;

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


class SexualOrientationController {

  /**
   * @api {get} /user/profile/sexual_orientation/list Show sexual orientation list
   * @apiName Sexual orientation list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    SexualOrientation.findAll({
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
   * @api {post} /user/profile/sexual_orientation/store Handles user profile sexual orientation store operation
   * @apiName Front user profile sexual orientation store operation
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

    if (req.body.other) {
      SexualOrientation.create({
        name: req.body.other,
        status: StatusHandler.pending
      })
      .then(response => {
        this.update(res, req.id, response.id);
      })
      .catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      })
    } else {
      SexualOrientation.findOne({
        where: {
          id: req.body.sexual_orientation
        }
      }).then(response => {
        this.update(res, req.id, req.body.sexual_orientation, response.name);
      });
    }
  }

  update = (res, userId, sexualOrientationId, name = '') => {
    UserMetadata.findOne({
      where: {
        user_id: userId
      }
    }).then(response => {
      if (!response) {
        UserMetadata.create({
          user_id: userId,
          sexual_orientation_id: sexualOrientationId
        })
        .then(response => {
          if (name) {
            let data = {
              id: userId,
              name: name
            }

            ElasticsearchEventsHandler.store(ElasticsearchEventsAction.sexualOrientationUpdate, data);
          }

          return ResponseHandler.success(res, responseLanguage.sexual_orientation_save);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        UserMetadata.update({
          sexual_orientation_id: sexualOrientationId
        },
        {
          where: {user_id: userId}
        })
        .then(response => {
          if (name) {
            let data = {
              id: userId,
              name: name
            }

            ElasticsearchEventsHandler.store(ElasticsearchEventsAction.sexualOrientationUpdate, data);
          }

          return ResponseHandler.success(res, responseLanguage.sexual_orientation_save);
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
}

module.exports = SexualOrientationController;
