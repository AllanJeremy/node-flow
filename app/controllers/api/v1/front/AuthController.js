require('dotenv').config();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');


/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

const RandomStringGenerator = require('../../../../helpers/RandomStringGenerator');

var MailHandler = require('../../../../helpers/MailHandler');
MailHandler = new MailHandler();

var Chat = require('../../../../helpers/Chat');
Chat = new Chat();

/**
 * Configs
 */
const authConfig = require('../../../../config/auth.config.js');


/**
 * Models
 */
const Models = require('../../../../models');
const User = Models.User;
const SystemSetting = Models.SystemSetting;
const VerifyUser = Models.VerifyUser;
const ResetPassword = Models.ResetPassword;

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


const templateName = [
  'email_verification',
  'reset_password',
]

class AuthController {



  /**
   * @api {post} /auth/signin Handles user login operation
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

      if (response.status == StatusHandler.pending) {
        return ResponseHandler.error(res, 423, responseLanguage.not_verified_account);
      }

      if (response.status == StatusHandler.blocked) {
        return ResponseHandler.error(res, 422, responseLanguage.blocked_account);
      }

      if (response.status == StatusHandler.deactivate) {
        return ResponseHandler.error(res, 422, responseLanguage.deactivate_account);
      }

      var token = jwt.sign({ id: response.id }, authConfig.secret, {
        expiresIn: authConfig.tokenExpiryTime
      });

      var chatToken = Chat.token(response.first_name);
      var data = {
        token: token,
        user: UserTransformer.user(response),
        chat_token: chatToken
      };

      return ResponseHandler.success(res, responseLanguage.login_success, data);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /auth/signup Handles user register operation
   * @apiName Front user register operation
   * @apiGroup Front
   *
   * @apiParam {String} [email] email
   * @apiParam {String} [password] password
   *
   * @apiSuccess (200) {Object}
   */
  SignUp = async(req, res) => {
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

          let verificationCode = RandomStringGenerator.string(5);

          VerifyUser.create({
            user_id: response.id,
            verification_code: verificationCode
          })
          .then(async response => {

            let template = templateName[0];
            let to = req.body.email;
            let data = [];
            data['params'] = {
              verificationCode: verificationCode
            }

            MailHandler.send(template, data, to);

            return ResponseHandler.success(res, responseLanguage.register_successfully);
          })
          .catch(err => {
            return ResponseHandler.error(res, 500, err.message);
          })
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


  /**
   * @api {post} /auth/email/resend_code Handles user register resend code operation
   * @apiName Front user register resend code operation
   * @apiGroup Front
   *
   * @apiParam {String} [email] email
   *
   * @apiSuccess (200) {Object}
   */
  ResendCode = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(response => {
      if (response) {
        let verificationCode = RandomStringGenerator.string(5);

        VerifyUser.update({
          verification_code: verificationCode
        },
        {
          where: {user_id: response.id}
        })
        .then(async response => {
          let template = templateName[0];
          let to = req.body.email;
          let data = [];
          data['params'] = {
            verificationCode: verificationCode
          }

          MailHandler.send(template, data, to);

          return ResponseHandler.success(res, responseLanguage.code_resend);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        })
      } else {
        return ResponseHandler.error(res, 422, responseLanguage.email_not_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {get} /auth/email/verify Handles email verification operation
   * @apiName Front email verification operation
   * @apiGroup Front
   *
   * @apiParam {String} [verification_code] verification_code
   *
   * @apiSuccess (200) {Object}
   */
  Verify = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    VerifyUser.findOne({
      where: {
        verification_code: req.body.verification_code
      }
    }).then(response => {
      if (!response) {
        return ResponseHandler.error(res, 400, responseLanguage.invalid_code);
      }

      let userId = response.user_id;

      User.update({
        status: StatusHandler.active,
      },
      {
        where: { id: userId },
        returning: true
      })
      .then(result => {
        VerifyUser.destroy({ where: { id: response.id }, force: true })
        .then(response => {

          var token = jwt.sign({ id: userId }, authConfig.secret, {
            expiresIn: authConfig.tokenExpiryTime
          });

          var data = {
            token: token
          };

          return ResponseHandler.success(res, responseLanguage.verified_success, data);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
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
   * @api {post} /auth/reset_password Handles forgot password request operation
   * @apiName Front forgot password request operation
   * @apiGroup Front
   *
   * @apiParam {String} [email] email
   *
   * @apiSuccess (200) {Object}
   */
  ForgotPasswordRequest = (req, res) => {

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
        return ResponseHandler.error(res, 422, validationLanguage.invalid_email);
      }

      let verificationCode = RandomStringGenerator.string(5);

      ResetPassword.findOne({
        where: {
          user_id: response.id
        }
      }).then(result => {
        if (!result) {
          ResetPassword.create({
            user_id: response.id,
            verification_code: verificationCode
          }).then(response => {
          })
          .catch(err => {
            return ResponseHandler.error(res, 500, err.message);
          });
        } else {
          ResetPassword.update({
            verification_code: verificationCode
          }, {
            where: { user_id: response.id },
            returning: true
          })
          .then(response => {
          })
          .catch(err => {
            return ResponseHandler.error(res, 500, err.message);
          });
        }

        let template = templateName[1];
        let to = req.body.email;
        let data = [];
        data['params'] = {
          verificationCode: verificationCode
        }

        MailHandler.send(template, data, to);

        return ResponseHandler.success(res, responseLanguage.reset_password_request_success);

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
   * @api {get} /auth/reset_password/verify Handles reset password operation
   * @apiName Front reset password operation
   * @apiGroup Front
   *
   * @apiParam {String} [verification_code] verification_code
   *
   * @apiSuccess (200) {Object}
   */
  ForgotPassword = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    ResetPassword.findOne({
      where: {
        verification_code: req.body.verification_code
      }
    }).then(response => {
      if (!response) {
        return ResponseHandler.error(res, 400, responseLanguage.invalid_code);
      }

      User.update({
        password: bcrypt.hashSync(req.body.password),
      },
      {
        where: { id: response.user_id },
        returning: true
      })
      .then(result => {
        ResetPassword.destroy({ where: { id: response.id }, force: true })
        .then(response => {
          return ResponseHandler.success(res, responseLanguage.password_reset_success);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
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

module.exports = AuthController;
