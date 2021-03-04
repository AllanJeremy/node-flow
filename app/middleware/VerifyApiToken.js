const jwt = require('jsonwebtoken');

/**
 * Configs
 */
const config = require('../config/auth.config.js');

/**
 * Languages
 */
const language = require('../language/en_default');
const responseLanguage = language.en.admin.response;

/**
 * Helpers
 */
var ResponseHandler = require('../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

/**
 * Routes Config
 */
const allRoutesConfig = require('../routes/admin/config');
const authRoute = allRoutesConfig.authRoute;
const routePrifix = allRoutesConfig.routePrifix;


exports.verify = (req, res, next) => {
  if (req.originalUrl.replace(routePrifix, '') === authRoute.AUTH_LOGIN) {
    return next();
  } else {
    let token = req.headers.authorization;

    if (!token) {
      return ResponseHandler.error(res, 403, responseLanguage.token_required);
    }

    token = token.split(' ')[1];

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return ResponseHandler.error(res, 401, responseLanguage.unauthorized);
      }

      req.id = decoded.id
      next();
    });
  }
}
