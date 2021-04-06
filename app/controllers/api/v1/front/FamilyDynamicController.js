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
const FamilyDynamic = Models.FamilyDynamic;
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


class FamilyDynamicController {

  /**
   * @api {get} /user/profile/family_dynamic/list Show family dynamic list
   * @apiName Family dynamic list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    FamilyDynamic.findAll({
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
   * @api {post} /user/profile/family_dynamic/store Handles user profile family dynamic store operation
   * @apiName Front user profile family dynamic store operation
   * @apiGroup Front
   *
   * @apiParam {String} [family_dynamic] family_dynamic
   *
   * @apiSuccess (200) {Object}
   */
  store = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    if (req.body.other) {
      FamilyDynamic.create({
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
      FamilyDynamic.findOne({
        where: {
          id: req.body.family_dynamic
        }
      }).then(response => {
        this.update(res, req.id, req.body.family_dynamic, response.name);
      });
    }
  }

  update = (res, userId, familyDynamicId, name = '') => {
    UserMetadata.findOne({
      where: {
        user_id: userId
      }
    }).then(response => {
      if (!response) {
        UserMetadata.create({
          user_id: userId,
          family_detail_id: familyDynamicId
        })
        .then(response => {

          if (name) {
            let data = {
              id: userId,
              name: name
            }

            ElasticsearchEventsHandler.store(ElasticsearchEventsAction.familyDynamicUpdate, data);
          }

          return ResponseHandler.success(res, responseLanguage.family_dynamic_save);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        UserMetadata.update({
          family_detail_id: familyDynamicId
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

            ElasticsearchEventsHandler.store(ElasticsearchEventsAction.familyDynamicUpdate, data);
          }

          return ResponseHandler.success(res, responseLanguage.family_dynamic_save);
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

module.exports = FamilyDynamicController;
