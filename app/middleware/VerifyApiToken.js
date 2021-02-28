const jwt = require('jsonwebtoken');

const config = require('../config/auth.config.js');

var language = require('../language/en_default');
var responsemessages = language.en.admin.response;

var APIResponse = require('../helpers/APIResponse');
APIResponse = new APIResponse();

exports.verify = (req, res, next) => {
	let token = req.headers['authorization'];

	if (!token) {

    return APIResponse.error(403, responsemessages.token_required, res);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {

      return APIResponse.error(401, responsemessages.unauthorized, res);
    }
    req.id = decoded.id
    next();
  });
}
