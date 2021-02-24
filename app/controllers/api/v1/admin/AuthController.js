var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const APIResponse = require('../../../../helper/APIResponse');
APIResponse = new APIResponse();

const config = require('../../../../config/auth.config.js');

const db = require('../../../../models');
const AdminUser = db.adminuser;

const language = require('../../../../language/en_default');
const responsemessages = language.en.admin.response;
const validation = language.en.admin.validation;

const UserTransform = require('../../../../transformers/admin/UserTransformer');
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

    	return APIResponse.error(422, errors.array, res);
    }

		AdminUser.findOne({
	    where: {
	      email: req.body.email
	    }
	  }).then(user => {
	    if (!user) {

	      return APIResponse.error(404, validation.email_invalid, res);
	    }

	    var passwordIsValid = bcrypt.compareSync(
	      req.body.password,
	      user.password
	    );

	    if (!passwordIsValid) {

        return APIResponse.error(401, validation.password_invalid, res);
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.tokenExpiryTime
      });

      var data = {
    		token: token,
    		user: UserTransform.SignIn(user)
    	};

      return APIResponse.success(200, responsemessages.login_success, res, data);
	  })
	  .catch(err => {

	    return APIResponse.error(500, err.message, res, []);
	  });
	}

}

module.exports = AuthController;