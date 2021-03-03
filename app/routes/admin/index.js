var path = require('path')
var fs = require('fs');

const { VerifyApiToken } = require('../../middleware');
const { HasPermission } = require('../../middleware');

module.exports = function(Joyn) {
  var routeFiles = fs.readdirSync(path.join(__dirname, 'router/'))

  routeFiles.forEach(function(file) {

    if (file === 'index.js' || file.substr(file.lastIndexOf('.') + 1) !== 'js')
      return;

    var name = file.substr(0, file.indexOf('.'));

    if(name === 'auth') {
      Joyn.use('/admin', require('./router/' + name));
    } else {
      Joyn.use(VerifyApiToken);
      Joyn.use(HasPermission);

      Joyn.use('/admin', require('./router/' + name));
    }

  });
}
