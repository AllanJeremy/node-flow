var path = require('path')
var fs = require('fs');

/**
 * Middlewares
 */
const { VerifyApiToken } = require('../../middleware');

module.exports = function(Joyn) {
  var routeFiles = fs.readdirSync(path.join(__dirname, 'router/'))

  Joyn.use(VerifyApiToken);

  routeFiles.forEach(function(file) {

    if (file === 'index.js' || file.substr(file.lastIndexOf('.') + 1) !== 'js')
      return;

    var name = file.substr(0, file.indexOf('.'));

    Joyn.use('/', require('./router/' + name));

  });
}
