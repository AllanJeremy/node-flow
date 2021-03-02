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
let routeConfig = require('../routes/admin/config');
routeConfig = routeConfig.apiRoute;

exports.verify = (req, res, next) => {
  AdminPermission.findOne({
    where: {admin_user_id: req.id }
  }).then(response => {

    let exists = false;
    let permissions = response.permissions.replace('{', '').replace('}', '');
    let currentRoute = req.originalUrl;
    currentRoute = currentRoute.replace('/admin','').replace(/\d/g, '');

    permissions.split(',').map((routeName, index) => {
      if (routeConfig[routeName].name == currentRoute) {
        exists = true;
        next();
      }
    });

    if (!exists) {
      return ResponseHandler.error(res, 400, responseLanguage.permission_denied);
    }
  })
  .catch(err => {
    console.log("testing", err.message);
    return ResponseHandler.error(res, 500, err.message);
  });
}
