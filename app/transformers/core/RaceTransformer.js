var fractal = require('fractal-transformer')();

class RaceTransformer {

	transform = (data) => fractal(data, {
    'id': 'id', 
    'name': 'name',
    'status': 'status'
  });
}

module.exports = RaceTransformer;