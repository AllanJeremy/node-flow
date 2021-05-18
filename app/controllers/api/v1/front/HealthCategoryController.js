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
    , order: [['name', 'ASC']]})
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

    const Op = Sequelize.Op;

    let healthCategories = req.body.health_categories;

    UserHealthCategory.destroy({
      where: {
        health_category_id: {[Op.notIn]: healthCategories},
        user_id: req.id
      }
    });

    healthCategories && healthCategories.length > 0 && healthCategories.length > 0 && healthCategories.map(async(item, index) => {
      this.update(req.id, item, req.body.status);
    });

    let isUserHealthCategoryExist = await UserHealthCategory.findOne({
      where: {
        user_id: req.id
      },
      include: [{
        model: HealthCategory,
        attributes: ['id', 'name'],
        as: 'health_category',
        where: { status: StatusHandler.pending }
      }],
      returning: true,
      raw: true
    });

    if (req.body.other) {
      if (isUserHealthCategoryExist) {
        HealthCategory.update({
          name: req.body.other
        },
        {
          where: {
            id: isUserHealthCategoryExist['health_category.id']
          }
        });
      } else {
        HealthCategory.create({
          name: req.body.other,
          status: StatusHandler.pending
        },
        {
          returning: true,
          raw:true
        })
        .then(response => {
          this.update(req.id, response.id, StatusHandler.pending);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      }
    } else {
      if (isUserHealthCategoryExist) {
        HealthCategory.destroy({
          where: {
            id: isUserHealthCategoryExist['health_category.id']
          }
        }).then(response => {
          UserHealthCategory.destroy({
            where: {
              health_category_id: isUserHealthCategoryExist['health_category.id']
            }
          });
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      }
    }

    return ResponseHandler.success(res, responseLanguage.health_category_save);
  }

  update = async(userId, healthCategoryId, status) => {
    let isUserHealthCategoryExist = await UserHealthCategory.findOne({
      where: {
        user_id: userId,
        health_category_id: healthCategoryId
      }
    });
    if (!isUserHealthCategoryExist) {
      UserHealthCategory.create({
        user_id: userId,
        health_category_id: healthCategoryId,
        status: status
      }).then(response => {
        this.updateElaticsearch(userId);
      })
      .catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      });
    } else {
      UserHealthCategory.update({
        status: status
      }, {
        where: {
          user_id: userId,
          health_category_id: healthCategoryId,
        }
      }).then(response => {
        if (status == StatusHandler.active) {
          this.updateElaticsearch(userId);
        }
      });
    }
  }

  updateElaticsearch = (userId) => {
    UserHealthCategory.findAll({
      where: {
        user_id: userId
      },
      include: [{
        model: HealthCategory,
        attributes: ['name'],
        as: 'health_category',
        where: { status: StatusHandler.active }
      }],
      raw: true
    }).then(response => {
      if (response && response.length > 0) {
        let healthCategories = response.map(item => item['health_category.name']);
        let data = {
          id: userId,
          name: healthCategories
        }
        ElasticsearchEventsHandler.store(ElasticsearchEventsAction.healthCategoryUpdate, data);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = HealthCategoryController;
