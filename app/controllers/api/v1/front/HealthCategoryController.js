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
const HealthCategory = Models.HealthCategory;
const HealthCategoryUser = Models.HealthCategoryUser;

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


class HealthCategoryController {

  /**
   * @api {get} /user/profile/health_category/list Show health category list
   * @apiName Health category list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    HealthCategory.findAll({
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
   * @api {post} /user/profile/health_category/store Handles user profile health category store operation
   * @apiName Front user profile health category store operation
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

    let HealthCategoriesName = req.body.name;

    HealthCategoriesName.length > 0 && HealthCategoriesName.map((item, index) => {
      HealthCategory.findOne({
        where: {
          name: item
        }
      }).then(response => {
        if (!response) {
          HealthCategory.create({
            name: item,
            status: StatusHandler.pending
          })
          .then(response => {
            this.update(res, req.id, response.id);
          })
          .catch(err => {
            return ResponseHandler.error(res, 500, err.message);
          })
        } else {
          this.update(res, req.id, response.id);
        }
      })
      .catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      });
    });
  }

  update = (res, userId, healthCategoryId) => {
    HealthCategoryUser.create({
      user_id: userId,
      health_category_id: healthCategoryId
    })
    .then(response => {
      return ResponseHandler.success(res, responseLanguage.profile_update);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = HealthCategoryController;
