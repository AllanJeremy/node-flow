var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { DateTime } = require('luxon');

/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

const RandomStringGenerator = require('../../../../helpers/RandomStringGenerator');
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
        email: req.body.email,
        status: StatusHandler.active
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
      var refreshToken = RandomStringGenerator.string(60);
      var expiresAt  = DateTime.now().plus({ hour: authConfig.expiryTime }).toISO();

      AdminUser.update({
        access_token: token,
      },
      {
        where: { id: response.id },
        returning: true
      })
      .then(result => {
        var data = {
          token: {
            token: token,
            refresh_token: refreshToken,
            expires_at: expiresAt
          },
          user: UserTransformer.AdminUser(response)
        };

        return ResponseHandler.success(res, responseLanguage.login_success, data);
      })
      .catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      });
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {post} /admin/auth/token Handles admin user token operation
   * @apiName Admin user token operation
   * @apiGroup Admin
   *
   * @apiParam {String} [token] token
   *
   * @apiSuccess (200) {Object}
   */
  accessToken = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    AdminUser.findOne({
      where: {
        access_token: req.body.access_token
      }
    }).then(response => {

      if (!response) {
        return ResponseHandler.error(res, 422, responseLanguage.unauthorized);
      }

      var token = jwt.sign({ id: response.id }, authConfig.secret, {
        expiresIn: authConfig.tokenExpiryTime
      });
      var refreshToken = RandomStringGenerator.string(60);
      var expiresAt  = DateTime.now().plus({ hour: authConfig.expiryTime }).toISO();

      AdminUser.update(
        { access_token: token },
        { where: { id: response.id }
      }).then(result => {
        if (result) {
          var data = {
            token: {
              token: token,
              refresh_token: refreshToken,
              expires_at: expiresAt
            },
          };

          return ResponseHandler.success(res, responseLanguage.token_success, data);
        } else {
          return ResponseHandler.error(res, 401, responseLanguage.unauthorized);
        }
      }).catch(err => {
        return ResponseHandler.error(res, 401, responseLanguage.unauthorized);
      });
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = AuthController;
