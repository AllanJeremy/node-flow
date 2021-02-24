var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

var APIResponse = require('../../../../helper/APIResponse');
APIResponse = new APIResponse();

const config = require('../../../../config/auth.config.js');
const db = require('../../../../models');

const AdminUser = db.adminuser;

var messages = require('../../../../langauge/en_default');
var ResMessages = messages.ENLanguage.admin.response;
var validation = messages.ENLanguage.admin.validation;

var AuthTransform = require('../../../../transformer/AuthTransformer');
AuthTransform = new AuthTransform();

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
        return res.status(422).json({ errors: errors.array() });
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
    		user: user
    	};

      return APIResponse.success(200, ResMessages.login_success, res, AuthTransform.SignIn(data));
	  })
	  .catch(err => {
	    res.status(500).send({ message: err.message });
	  });
	}

}

module.exports = AuthController;