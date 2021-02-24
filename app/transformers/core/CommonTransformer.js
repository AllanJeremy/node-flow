var fractal = require('fractal-transformer')();

class CommonTransformer {

	transform = (data) => fractal(data, {
    'id': 'id', 
    'name': 'name',
    'status': 'status'
  });
}

module.exports = CommonTransformer;