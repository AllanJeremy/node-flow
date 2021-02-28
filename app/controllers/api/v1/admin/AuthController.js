var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

/**
 * Configs
 */
const authConfig = require('../../../../config/auth.config.js');

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

class AuthController {

  /**
   * @api {post} /admin/auth/signin Handles admin user login operation
   * @apiName Admin user login operation
   * @apiGroup Admin
   *
   * @apiParam {String} [email] email
   * @apiParam {String} [password] password
   *
   * @apiSuccess (200) {Object}
   */
  SignIn = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    AdminUser.findOne({
      where: {
        email: req.body.email
      }
    }).then(response => {

      if (!response) {
        return ResponseHandler.error(res, 422, validationLanguage.invalid_credentials);
      }

      var isPasswordValid = bcrypt.compareSync(
        req.body.password,
        response.password
      );

      if (!isPasswordValid) {
        return ResponseHandler.error(res, 422, validationLanguage.invalid_credentials);
      }

      var token = jwt.sign({ id: response.id }, authConfig.secret, {
        expiresIn: authConfig.tokenExpiryTime
      });

      var data = {
        token: token,
        user: UserTransformer.AdminUser(response)
      };

      return ResponseHandler.success(res, responseLanguage.login_success, data);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = AuthController;
