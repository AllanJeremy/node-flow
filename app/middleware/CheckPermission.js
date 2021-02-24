const db = require('../models');
const AdminPermission = db.admin_permission;

var APIResponse = require('../helper/APIResponse');
APIResponse = new APIResponse();

const language = require('../language/en_default');
const responsemessages = language.en.admin.response;

exports.check = (req, res, next) => {
  AdminPermission.findOne({where: {admin_user_id: req.id}}).then(adminpermission => {
    let permissions = adminpermission['permissions'];
    let currentRoute = req.originalUrl;
    currentRoute = currentRoute.replace('/admin/','').replace(/\d/g, '');
 
    Object.keys(permissions).map((item, index) => {
      let routeName = item.replace('*', '');
      if(routeName == currentRoute) {
        next();
      } else {
        //return APIResponse.error(400, responsemessages.permission_denied, res);
      }
    });
  })
  .catch(err => {
    return APIResponse.error(500, err.message, res);
  });
 
}