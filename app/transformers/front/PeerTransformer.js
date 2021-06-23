var fractal = require('fractal-transformer')();

class PeerTransformer {

  peer = (data) => fractal(data, {
    'id': 'id',
    'first_name': 'peer.first_name',
    'profile_picture': function (data) {
      return process.env.API_IMAGE_URL + '/avatar/' + data.get('peer.profile_picture');
    },
  });

  newMatch = (data) => fractal(data, {
    'id': 'id',
    'first_name': function (data) {
      return data.get('first_name')  ;
    },
    'profile_picture': function (data) {
      return process.env.API_IMAGE_URL + '/avatar/' + data.get('profile_picture');
    },
    'health_categories': 'health_categories',
  });
}

module.exports = PeerTransformer;
