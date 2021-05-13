var fractal = require('fractal-transformer')();

class AvatarTransformer {

  transform = (data) => fractal(data, {
    'id': 'id',
    'name': 'name',
    'status': 'status'
  });
}

module.exports = AvatarTransformer;