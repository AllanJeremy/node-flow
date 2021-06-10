require('dotenv').config();
const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');


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
const UserMetadata = Models.UserMetadata;
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
    , order: [['name', 'ASC']]})
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
  store = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    let userSelectedFamilyDynamic = req.body.family_dynamics;

    let isUserFamilyDynamicExist = await UserFamilyDynamic.findOne({
      where: {
        user_id: req.id
      },
      include: [{
        model: FamilyDynamic,
        attributes: ['id', 'name'],
        as: 'family_dynamic',
        where: { status: StatusHandler.pending }
      }],
      returning: true,
      raw: true
    });

    if (req.body.other) {
      if (isUserFamilyDynamicExist) {
        FamilyDynamic.update({
          name: req.body.other
        },
        {
          where: {
            id: isUserFamilyDynamicExist['family_dynamic.id']
          }
        });
        userSelectedFamilyDynamic.push(isUserFamilyDynamicExist['family_dynamic.id']);
      } else {
        FamilyDynamic.create({
          name: req.body.other,
          status: StatusHandler.pending
        },
        {
          returning: true,
          raw:true
        })
        .then(response => {
          userSelectedFamilyDynamic.push(response.id);
          this.update(req.id, response.id, StatusHandler.pending);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      }
    } else {
      if (isUserFamilyDynamicExist) {
        FamilyDynamic.destroy({
          where: {
            id: isUserFamilyDynamicExist['family_dynamic.id']
          }
        }).then(response => {
          UserFamilyDynamic.destroy({
            where: {
              family_dynamic_id: isUserFamilyDynamicExist['family_dynamic.id']
            }
          });
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      }
    }

    const Op = Sequelize.Op;

    UserFamilyDynamic.destroy({
      where: {
        family_dynamic_id: {[Op.notIn]: req.body.family_dynamics},
        user_id: req.id
      }
    });

    if (req.body.family_dynamics && req.body.family_dynamics.length > 0 ) {
      var familyDynamics = req.body.family_dynamics;
      var status = req.body.status;
      familyDynamics.map(async(item, index) => {
        this.update(req.id, item, status);
      });
    }

    UserMetadata.findOne({
      where: {
        user_id: req.id
      }
    }).then(response => {
      if (!response) {
        UserMetadata.create({
          user_id: req.id,
          family_dynamic_status: req.body.status
        });
      } else {
        UserMetadata.update({
          family_dynamic_status: req.body.status
        },
        {
          where: {user_id: req.id}
        });
      }
    });

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
        if (status == StatusHandler.active) {
          this.updateElaticsearch(userId);
        }
      });
    } else {
      UserFamilyDynamic.update({
        status: status
      }, {
        where: {
          user_id: userId,
          family_dynamic_id: familyDynamicId,
        }
      }).then(response => {
        if (status == StatusHandler.active) {
          this.updateElaticsearch(userId);
        }
      });
    }
  }

  updateElaticsearch = (userId) => {
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
  }
}

module.exports = FamilyDynamicController;
