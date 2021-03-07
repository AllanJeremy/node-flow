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
const AdminPermission = Models.AdminPermission;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.admin.response;
const validationLanguage = language.en.admin.validation;

/**
 * Transformers
 */
var UserTransformer = require('../../../../transformers/admin/UserTransformer');
UserTransformer = new UserTransformer();

/**
 * Route Configs
 */
const routeConfig = require('../../../../routes/admin/config');
const apiRoute = routeConfig.apiRoute;

class AdminPermissionController {

  /**
   * @api {post} /admin/admin_permission/list Handles admin permission list
   * @apiName Admin permission list
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  permissionList = (req, res) => {
    let permissionList = [];

    Object.entries(apiRoute).map(item => {
      permissionList.push({
        'label': item[1].label,
        'value': item[0]
      })
    });

    return ResponseHandler.success(res, '', permissionList);
  }


  /**
   * @api {post} /admin/admin_permission/list/user_id Handles admin user permission list
   * @apiName Admin user permission list
   * @apiGroup Admin
   *
   * @apiParam {Array} [permissions] permissions
   * @apiParam {Integer} [admin_user_id] admin_user_id
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    AdminPermission.findOne({
      where: {
        admin_user_id: req.params.user_id
      },
      order: [['id', 'DESC']]
    })
    .then(response => {
      return ResponseHandler.success(res, '', UserTransformer.AdminPermission(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /admin/admin_permission/store Handles store admin user permission operation
   * @apiName Admin permission store
   * @apiGroup Admin
   *
   * @apiParam {Array} [permissions] permissions
   * @apiParam {Integer} [admin_user_id] admin_user_id
   *
   * @apiSuccess (200) {Object}
   */
  store = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.admin_permission_required, errors.array());
    }
    AdminPermission.findOne({
      where: {
        admin_user_id: req.body.admin_user_id
      }
    })
    .then(response => {
      if (!response) {
        AdminPermission.create({
          admin_user_id: req.body.admin_user_id,
          permissions: req.body.permissions.toString()
        })
        .then(response => {
          return ResponseHandler.success(
            res, responseLanguage.admin_permission_store_success, UserTransformer.AdminPermission(response));
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        AdminPermission.update({
          permissions: req.body.permissions.toString()
        },
        {
          where: { admin_user_id: req.body.admin_user_id },
          returning: true
        })
        .then(response => {
          return ResponseHandler.success(
            res, responseLanguage.admin_permission_update_success, UserTransformer.AdminPermission(response));
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

module.exports = AdminPermissionController;
