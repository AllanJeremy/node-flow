const { validationResult } = require('express-validator');

/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const ElasticsearchEventsAction = require('../../../../helpers/ElasticsearchEventsAction');

const StatusHandler = require('../../../../helpers/StatusHandler');

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
const responseLanguage = language.en.admin.response;
const validationLanguage = language.en.admin.validation;

/**
 * Transformers
 */
var CommonTransformer = require('../../../../transformers/core/CommonTransformer');
CommonTransformer = new CommonTransformer();

class HealthCategoryController {

  /**
   * @api {get} /admin/health_category/list Handles health category list
   * @apiName Health list
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    HealthCategory.findAll({order: [['id', 'DESC']]})
    .then(response => {
      return ResponseHandler.success(res, '', CommonTransformer.transform(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /admin/health_category/store Handles health category store operation
   * @apiName Health category store
   * @apiGroup Admin
   *
   * @apiParam {String} [name] name
   * @apiParam {String} [status] status
   *
   * @apiSuccess (200) {Object}
   */
  store = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    HealthCategory.findOne({
      where: {
        name: req.body.name
      }
    }).then(response => {
      if (!response) {
        HealthCategory.create({
          name: req.body.name,
          status: req.body.status
        })
        .then(response => {
          return ResponseHandler.success(
            res, responseLanguage.health_category_store_success, CommonTransformer.transform(response));
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        })
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.health_category_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {patch} /admin/health_category/update Handles health update operation
   * @apiName Health category update
   * @apiGroup Admin
   *
   * @apiParam {String} [name] name
   * @apiParam {String} [status] status
   * @apiParam {Integer} [id] id
   *
   * @apiSuccess (200) {Object}
   */
  update = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    HealthCategory.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        HealthCategory.update({
          name: req.body.name,
          status: req.body.status,
        },
        {
          where: { id: req.params.id },
          returning: true
        })
        .then(result => {

          if(response.name != req.body.name) {
            let data = {
              old_name: response.name,
              name: req.body.name
            }
            ElasticsearchEventsHandler.store(ElasticsearchEventsAction.healthCategoryRenamed, data);
          }

          return ResponseHandler.success(
            res, responseLanguage.health_category_update_success, CommonTransformer.transform(result));
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.not_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {delete} /admin/health_category/destroy Handles health destroy operation
   * @apiName Health category destroy
   * @apiGroup Admin
   *
   * @apiParam {Integer} [id] id
   *
   * @apiSuccess (200) {Object}
   */
  destroy = (req, res) => {
    HealthCategory.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        let name = response.name;

        HealthCategory.destroy({ where: { id: req.params.id } })
        .then(response => {

          UserHealthCategory.destroy({
            where: { health_category_id: req.params.id }
          });

          let data = {
            name: name
          }
          ElasticsearchEventsHandler.store(ElasticsearchEventsAction.healthCategoryDelete, data);

          return ResponseHandler.success(res, responseLanguage.health_category_delete_success);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.not_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /admin/health_category/merge Merge health category
   * @apiName Merge health category
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  merge = (req, res) => {
    HealthCategory.findOne({
      where: {
        id: req.body.id
      }
    })
    .then(response => {
      UserHealthCategory.update({
          health_category_id: req.body.merged_id,
        },
        {
        where: { health_category_id: req.body.id },
        returning: true,
        plain: true
      })
      .then(response => {

        UserHealthCategory.findAll({
          where: {
            user_id: response[1].dataValues.user_id
          },
          include: [{
            model: HealthCategory,
            attributes: ['name'],
            as: 'health_category',
            where: { status: StatusHandler.active }
          }],
          raw: true
        }).then(result => {
          if (result && result.length > 0) {
            let healthCategories = result.map(item => item['health_category.name']);
            let data = {
              id: response[1].dataValues.user_id,
              name: healthCategories
            }
            ElasticsearchEventsHandler.store(ElasticsearchEventsAction.healthCategoryUpdate, data);
          }
        });

        HealthCategory.destroy({ where: { id: req.body.id }, force: true });
        return ResponseHandler.success(res, responseLanguage.health_category_merge_success);
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

module.exports = HealthCategoryController;
