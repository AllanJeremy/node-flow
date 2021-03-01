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

exports.verify = (req, res, next) => {
  AdminPermission.findOne({
    where: {admin_user_id: req.id }
  }).then(response => {
    let exists = false;
    let permissions = response.permissions;
    let currentRoute = req.originalUrl;

    currentRoute = currentRoute.replace('/admin/','').replace(/\d/g, '');

    Object.keys(permissions).map((routeName, index) => {
      if (routeName == currentRoute) {
        exists = true;
        next();
      }
    });

    console.log(exists);

    if (!exists) {
      return ResponseHandler.error(res, 400, responseLanguage.permission_denied);
    }
  })
  .catch(err => {
    return ResponseHandler.error(res, 500, err.message);
  });
}
