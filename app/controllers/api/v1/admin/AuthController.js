var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

var APIResponse = require('../../../../helper/APIResponse');
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
	 * Signig for admin user.
	 *
	 * @param Object req
	 * @return Object res
	 */
	SignIn = (req, res) => {

	  const errors = validationResult(req);
    if (!errors.isEmpty()) {

    	return APIResponse.success(0, errors.array, res);
    }

		AdminUser.findOne({
	    where: {
	      email: req.body.email
	    }
	  }).then(response => {
	    if (!response) {

	      return APIResponse.success(0, validationLanguage.email_invalid, res);
	    }

	    var passwordIsValid = bcrypt.compareSync(
	      req.body.password,
	      response.password
	    );

	    if (!passwordIsValid) {

        return APIResponse.success(0, validationLanguage.password_invalid, res);
      }

      var token = jwt.sign({ id: response.id }, config.secret, {
        expiresIn: config.tokenExpiryTime
      });

      var data = {
    		token: token,
    		user: UserTransform.SignIn(response)
    	};

      return APIResponse.success(1, responseLanguage.login_success, res, data);
	  })
	  .catch(err => {

	    return APIResponse.error(500, err.message, res);
	  });
	}

}

module.exports = AuthController;