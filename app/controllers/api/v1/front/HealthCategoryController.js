require('dotenv').config();
const { validationResult } = require('express-validator');


/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

const SearchActivityAction = require('../../../../helpers/SearchActivityAction');

var SearchActivityHandler = require('../../../../helpers/SearchActivityHandler');
SearchActivityHandler = new SearchActivityHandler();


/**
 * Models
 */
const Models = require('../../../../models');
const HealthCategory = Models.HealthCategory;
const UserHealthCategory = Models.UserHealthCategory;

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
   * @apiParam {Array} [health_categories] health_categories
   *
   * @apiSuccess (200) {Object}
   */
  store = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    let healthCategories = req.body.health_categories;

    healthCategories && healthCategories.length > 0 && healthCategories.length > 0 && healthCategories.map(async(item, index) => {
      this.update(req.id, item);
    });
    if(req.body.other) {
      let healthCategory = await HealthCategory.create({
        name: req.body.other,
        status: StatusHandler.pending
      });
      this.update(req.id, healthCategory.id);
    }

    return ResponseHandler.success(res, responseLanguage.health_category_save);
  }

  update = async(userId, healthCategoryId) => {
    let isUserHealthCategoryExist = await UserHealthCategory.findOne({
      where: {
        user_id: userId,
        health_category_id: healthCategoryId
      }
    });
    if(!isUserHealthCategoryExist) {
      UserHealthCategory.create({
        user_id: userId,
        health_category_id: healthCategoryId
      }).then(response => {
        UserHealthCategory.findAll({
          where: {
            user_id: userId
          },
          include: [{
            model: HealthCategory,
            attributes: ['name'],
            as: 'health_category'
          }],
          raw: true
        }).then(response => {
          let healthCategories = response.map(item => item['health_category.name']);
          let data = {
            id: userId,
            name: healthCategories
          }
          SearchActivityHandler.store(SearchActivityAction.healthCategory, data);
        });
      });
    }
  }

}

module.exports = HealthCategoryController;
