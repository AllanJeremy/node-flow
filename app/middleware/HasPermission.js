/**
 * Models
 */
const Models = require('../models');
const AdminPermission = Models.AdminPermission;

/**
 * Helpers
 */
var ResponseHandler = require('../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

/**
 * Languages
 */
const language = require('../language/en_default');
const responseLanguage = language.en.admin.response;
const validationLanguage = language.en.admin.validation;

/**
 * Route Config
 */
const allRoutesConfig = require('../routes/admin/config');
const apiRoute = allRoutesConfig.apiRoute;
const authRoute = allRoutesConfig.authRoute;
const routePrefix = allRoutesConfig.routePrefix;


exports.verify = (req, res, next) => {
  if (req.originalUrl.replace(routePrefix, '') === authRoute.AUTH_LOGIN) {
    return next();
  } else {
    AdminPermission.findOne({
      where: {admin_user_id: req.id }
    }).then(response => {

      let exists = false;
      let permissions = response.permissions.replace('{', '').replace('}', '');
      let currentRoute = req.originalUrl;
      currentRoute = currentRoute.replace(routePrefix,'');

      permissions.split(',').map((routeName, index) => {
        var routeMatchName = apiRoute[routeName].name;
        var routeRegex = routeMatchName.split(':id').join('([\\d-]+)');
        routeRegex = '^' + routeRegex + '$';
        if (currentRoute.match(routeRegex) !== null) {
          exists = true;
          next();
        }
      });

      if (!exists) {
        return ResponseHandler.error(res, 400, responseLanguage.permission_denied);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }
}
