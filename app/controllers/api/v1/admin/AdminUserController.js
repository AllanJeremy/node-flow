const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');
const Op = Sequelize.Op

/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

/**
 * Models
 */
const Models = require('../../../../models');
const AdminUser = Models.AdminUser;

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


class AdminUserController {

  /**
   * @api {post} /admin/admin_user/list Show admin user list
   * @apiName Admin user list
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    AdminUser.findAll({
      where: {
        id: {
          [Op.ne]: req.id
        }
      },
      order: [['id', 'DESC']]
    })
    .then(response => {
      return ResponseHandler.success(res, '', UserTransformer.AdminUser(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {post} /admin/admin_user/store Handles admin user store operation
   * @apiName admin user store
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
    AdminUser.findOne({
      where: {
        email: req.body.email
      }
    }).then(response => {
      if (!response) {
        AdminUser.create({
          email: req.body.email,
          password: req.body.password,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          status: req.body.status,
        })
        .then(response => {
          return ResponseHandler.success(
            res, responseLanguage.admin_user_store_success, UserTransformer.AdminUser(response));
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        })
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.admin_user_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /admin/admin_user/update Handles admin user update operation
   * @apiName Admin user update
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

    AdminUser.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        AdminUser.update({
          email: req.body.email,
          password: req.body.password,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          status: req.body.status,
        },
        {
          where: { id: req.params.id },
          returning: true
        })
        .then(result => {
          return ResponseHandler.success(
            res, responseLanguage.admin_user_update_success, UserTransformer.AdminUser(result));
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.admin_user_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /admin/admin_user/destroy Handles admin user destroy operation
   * @apiName Admin user destroy
   * @apiGroup Admin
   *
   * @apiParam {Integer} [id] id
   *
   * @apiSuccess (200) {Object}
   */
  destroy = (req, res) => {
    AdminUser.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        AdminUser.destroy({ where: { id: req.params.id } })
        .then(response => {
          return ResponseHandler.success(res, responseLanguage.admin_user_delete_success);
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

module.exports = AdminUserController;
