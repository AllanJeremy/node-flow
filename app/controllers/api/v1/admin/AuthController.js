var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

var APIResponse = require('../../../../helpers/APIResponse');
APIResponse = new APIResponse();

const config = require('../../../../config/auth.config.js');

const db = require('../../../../models');
const AdminUser = db.adminuser;

const language = require('../../../../language/en_default');
const responseLanguage = language.en.admin.response;
const validationLanguage = language.en.admin.validation;

var UserTransform = require('../../../../transformers/admin/UserTransformer');
UserTransform = new UserTransform();

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
      return APIResponse.error(400, errors.array(), res);
    }

    AdminUser.findOne({
      where: {
        email: req.body.email
      }
    }).then(response => {

      if (!response) {

        return APIResponse.error(400, validationLanguage.invalid_credentials, res);
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        response.password
      );

      if (!passwordIsValid) {

        return APIResponse.error(422, validationLanguage.invalid_credentials, res);
      }

      var token = jwt.sign({ id: response.id }, config.secret, {
        expiresIn: config.tokenExpiryTime
      });

      var data = {
        token: token,
        user: UserTransform.SignIn(response)
      };

      return APIResponse.success(responseLanguage.login_success, res, data);
    })
    .catch(err => {

      return APIResponse.error(500, err.message, res);
    });
  }

}

module.exports = AuthController;
