const { validationResult } = require('express-validator');

/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

/**
 * Models
 */
const Models = require('../../../../models');
const HealthCategory = Models.HealthCategory;

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
   * @api {post} /admin/health_category/list Handles health category list
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
   * @api {post} /admin/health_category/update Handles health update operation
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
   * @api {post} /admin/health_category/destroy Handles health destroy operation
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
        HealthCategory.destroy({ where: { id: req.params.id } })
        .then(response => {
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
}

module.exports = HealthCategoryController;
