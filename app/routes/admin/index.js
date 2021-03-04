var path = require('path')
var fs = require('fs');

/**
 * Middlewares
 */
const { VerifyApiToken } = require('../../middleware');
const { HasPermission } = require('../../middleware');

/**
 * Route Configs
 */
const routeConfig = require('./config');
const routePrefix = routeConfig.routePrefix;

module.exports = function(Joyn) {
  var routeFiles = fs.readdirSync(path.join(__dirname, 'router/'))

  routeFiles.forEach(function(file) {

    if (file === 'index.js' || file.substr(file.lastIndexOf('.') + 1) !== 'js')
      return;

    var name = file.substr(0, file.indexOf('.'));

    Joyn.use(VerifyApiToken);
    Joyn.use(HasPermission);

    Joyn.use(routePrefix, require('./router/' + name));

  });
}
