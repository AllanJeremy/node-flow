var path = require('path')
var fs = require('fs');


/**
 * Route Configs
 */
const routeConfig = require('./config');

module.exports = function(Joyn) {
  var routeFiles = fs.readdirSync(path.join(__dirname, 'router/'))

  routeFiles.forEach(function(file) {

    if (file === 'index.js' || file.substr(file.lastIndexOf('.') + 1) !== 'js')
      return;

    var name = file.substr(0, file.indexOf('.'));

    Joyn.use('/', require('./router/' + name));

  });
}
