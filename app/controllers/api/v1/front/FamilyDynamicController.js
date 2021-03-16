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
const FamilyDynamic = Models.FamilyDynamic;
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


class FamilyDynamicController {

  /**
   * @api {post} /profile/family_dynamic/list Show family dynamic list
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
   * @api {post} /profile/family_dynamic/store Handles user profile family dynamic store operation
   * @apiName Front user profile family dynamic store operation
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

    FamilyDynamic.findOne({
      where: {
        name: req.body.name
      }
    }).then(response => {
      if (!response) {
        FamilyDynamic.create({
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

  updateUser = (res, user_id, family_dynamic_id) => {
    UserDetail.findOne({
      where: {
        id: user_id
      }
    }).then(response => {
      UserDetail.update({
        family_detail_id: family_dynamic_id
      },
      {
        where: {id: response.id}
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

module.exports = FamilyDynamicController;
