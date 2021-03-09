var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

/**
 * Configs
 */
const authConfig = require('../../../../config/auth.config.js');

/**
 * Models
 */
const Models = require('../../../../models');
const User = Models.User;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;

/**
 * Transformers
 */
var UserTransformer = require('../../../../transformers/front/UserTransformer');
UserTransformer = new UserTransformer();

class AuthController {



  /**
   * @api {post} /signin Handles user login operation
   * @apiName Front user login operation
   * @apiGroup Front
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

    User.findOne({
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

      var data = {
        token: token,
        user: UserTransformer.user(response)
      };

      return ResponseHandler.success(res, responseLanguage.login_success, data);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /signup Handles user register operation
   * @apiName Front user register operation
   * @apiGroup Front
   *
   * @apiParam {String} [email] email
   * @apiParam {String} [password] password
   *
   * @apiSuccess (200) {Object}
   */
  SignUp = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(response => {
      if (!response) {
        User.create({
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password),
          status: StatusHandler.pending
        })
        .then(response => {
          return ResponseHandler.success(res, responseLanguage.email_added_successfully, UserTransformer.user(response));
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        })
      } else {
        return ResponseHandler.error(res, 422, responseLanguage.email_already_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = AuthController;
