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
const UserFamilyDynamic = Models.UserFamilyDynamic;

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
   * @apiParam {String} [other] other
   * @apiParam {boolean} [status] status
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
    }

    if(req.body.family_dynamics.length > 0 ) {
      var familyDynamics = req.body.family_dynamics;
      var status = req.body.status;
      familyDynamics.map(async(item, index) => {
        this.update(req.id, item, status);
      });
    }
    return ResponseHandler.success(res, responseLanguage.family_dynamic_save);
  }

  update = async(userId, familyDynamicId, status) => {
    let isUserFamilyDynamicExist = await UserFamilyDynamic.findOne({
      where: {
        user_id: userId,
        family_dynamic_id: familyDynamicId
      }
    });
    if (!isUserFamilyDynamicExist) {
      UserFamilyDynamic.create({
        user_id: userId,
        family_dynamic_id: familyDynamicId,
        status: status
      }).then(response => {
        UserFamilyDynamic.findAll({
          where: {
            user_id: userId
          },
          include: [{
            model: FamilyDynamic,
            attributes: ['name'],
            as: 'family_dynamic',
            where: { status: StatusHandler.active }
          }],
          raw: true
        }).then(response => {
          if (response && response.length > 0) {
            let familyDynamics = response.map(item => item['family_dynamic.name']);
            let data = {
              id: userId,
              name: familyDynamics
            }
            ElasticsearchEventsHandler.store(ElasticsearchEventsAction.familyDynamicUpdate, data);
          }
        }).catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      });
    }
  }
}

module.exports = FamilyDynamicController;
