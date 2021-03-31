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
 * Admin Routes Config
 */
const allAdminRoutesConfig = require('../routes/admin/config');
const authAdminRoute = allAdminRoutesConfig.authRoute;
const routePrefix = allAdminRoutesConfig.routePrefix;

/**
 * Admin Routes Config
 */
const allFrontRoutesConfig = require('../routes/front/config');
const authFrontRoute = allFrontRoutesConfig.authRoute;


exports.verify = (req, res, next) => {

  let currentURL = req.originalUrl;
  let isAdmin = currentURL.includes(routePrefix);
  let isPublicRoute = false;
  let adminPublicRoute = [
    authAdminRoute.AUTH_LOGIN,
    authAdminRoute.AUTH_TOKEN
  ]

  if (isAdmin) {
    isPublicRoute = adminPublicRoute.indexOf(currentURL.replace(routePrefix, '')) > -1 ? true : false;

  } else {
    isPublicRoute = Object.values(authFrontRoute).indexOf(currentURL) > -1 ? true : false;
  }

  if (isPublicRoute) {
    return next();
  } else {
    let token = req.headers.authorization;

    if (!token) {
      return ResponseHandler.error(res, 403, responseLanguage.token_required);
    }

    token = token.split(' ')[1];

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        if(err.name == 'TokenExpiredError') {

          return ResponseHandler.error(res, 410, responseLanguage.unauthorized);
        }

        return ResponseHandler.error(res, 401, responseLanguage.unauthorized);
      }

      req.id = decoded.id
      next();
    });
  }
}
