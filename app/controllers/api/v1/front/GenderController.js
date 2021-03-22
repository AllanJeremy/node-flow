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
const Gender = Models.Gender;
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


class GenderController {

  /**
   * @api {get} /user/profile/gender/list Show race list
   * @apiName Race list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    Gender.findAll({
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
   * @api {post} /user/profile/gender/store Handles user profile gender store operation
   * @apiName Front user profile gender store operation
   * @apiGroup Front
   *
   * @apiParam {String} [gender] gender
   *
   * @apiSuccess (200) {Object}
   */
  store = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }
    if(req.body.others) {
      Gender.create({
        name: req.body.others,
        status: StatusHandler.pending
      })
      .then(response => {
        this.update(res, req.id, response.id);
      })
      .catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      })
    } else {
      this.update(res, req.id, req.body.gender);
    }
  }

  update = (res, userId, genderId) => {
    UserDetail.findOne({
      where: {
        user_id: userId
      }
    }).then(response => {
      if(!response) {
        UserDetail.create({
          user_id: userId,
          gender_id: genderId
        })
        .then(response => {
          return ResponseHandler.success(res, responseLanguage.gender_save);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        UserDetail.update({
          gender_id: genderId
        },
        {
          where: {user_id: userId}
        })
        .then(response => {
          return ResponseHandler.success(res, responseLanguage.gender_save);
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

module.exports = GenderController;
