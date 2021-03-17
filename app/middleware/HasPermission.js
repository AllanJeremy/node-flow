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
  let currentRoute = req.originalUrl;
  currentRoute = currentRoute.replace(routePrefix, '');
  let isAuthRoute = false;
  Object.entries(authRoute).map((routeName, index) => {
    var routeMatchName = routeName[1];
    var slug = routeMatchName.split(':');
    slug = slug.length > 1 ? slug[1] : '';
    var routeRegex = generateMatchRoute(routeMatchName, slug);
    routeRegex = '^' + routeRegex + '$';
    if (currentRoute.match(routeRegex) !== null) {
      isAuthRoute = true
    }
  });

  if (isAuthRoute) {
    return next();
  } else {
    AdminPermission.findOne({
      where: {admin_user_id: req.id }
    }).then(response => {
      let exists = false;
      let permissions = response.permissions.replace(/^"|"$/g, '').split(',');

      permissions.map((routeName, index) => {
        var routeMatchName = apiRoute[routeName].name;
        var slug = routeMatchName.split(':');
        slug = slug.length > 1 ? slug[1] : '';
        var routeRegex = generateMatchRoute(routeMatchName, slug);
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

function generateMatchRoute(routeName, slug) {
  switch(slug) {
    case 'id':
      return routeName.split(':id').join('([\\d-]+)');

    case 'user_id':
      return routeName.split(':user_id').join('([\\d-]+)');

    default:
      return routeName;
  }
}
