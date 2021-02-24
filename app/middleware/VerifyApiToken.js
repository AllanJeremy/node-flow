const jwt = require('jsonwebtoken');

const config = require('../config/auth.config.js');

var language = require('../language/en_default');
var ResMessages = language.en.admin.response;

exports.verify = (req, res, next) => {
	let token = req.headers['authorization'];
	if (!token) {
    return res.status(403).send({
      message: ResMessages.token_required
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized'
      });
    }
    
    next();
  });
}