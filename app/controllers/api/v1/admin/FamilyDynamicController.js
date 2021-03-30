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
const FamilyDynamic = Models.FamilyDynamic;
const UserMetadata = Models.UserMetadata;


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


class FamilyDynamicController {

  /**
   * @api {get} /admin/family_dynamic/list Show Family dynamic
   * @apiName Family dynamic list
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    FamilyDynamic.findAll({order: [['id', 'DESC']]})
    .then(response => {
      return ResponseHandler.success(res, '', CommonTransformer.transform(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {post} /admin/family_dynamic/store Handles Family dynamic store operation
   * @apiName Family dynamic store
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

    FamilyDynamic.findOne({
      where: {
        name: req.body.name
      }
    }).then(response => {
      if (!response) {
        FamilyDynamic.create({
          name: req.body.name,
          status: req.body.status
        })
        .then(response => {
          return ResponseHandler.success(
            res, responseLanguage.family_dynamic_store_success, CommonTransformer.transform(response));
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        })
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.family_dynamic_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {patch} /admin/family_dynamic/update Handles Family dynamic update operation
   * @apiName Family dynamic update
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
      return ResponseHandler.error(res, 422, errors.array());
    }

    FamilyDynamic.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        FamilyDynamic.update({
          name: req.body.name,
          status: req.body.status,
        },
        {
          where: { id: req.params.id },
          returning: true
        })
        .then(result => {
          return ResponseHandler.success(
            res, responseLanguage.family_dynamic_update_success, CommonTransformer.transform(result));
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
   * @api {delete} /admin/family_dynamic/destroy Handles Family dynamic destroy operation
   * @apiName Family dynamic destroy
   * @apiGroup Admin
   *
   * @apiParam {Integer} [id] id
   *
   * @apiSuccess (200) {Object}
   */
  destroy = (req, res) => {
    FamilyDynamic.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        FamilyDynamic.destroy({ where: { id: req.params.id } })
        .then(response => {
          return ResponseHandler.success(res, responseLanguage.family_dynamic_delete_success);
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
   * @api {post} /admin/family_dynamic/merge Merge Family dynamic
   * @apiName Merge family dynamic
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  merge = (req, res) => {
    FamilyDynamic.findOne({
      where: {
        id: req.body.id
      }
    })
    .then(response => {
      UserMetadata.update({
          family_detail_id: req.body.merged_id,
        },
        {
        where: { family_detail_id: req.body.id },
        returning: true
      })
      .then(response => {
        FamilyDynamic.destroy({ where: { id: req.body.id }, force: true });
        return ResponseHandler.success(res, responseLanguage.family_dynamic_merge_success);
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
