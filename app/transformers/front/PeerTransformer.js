var fractal = require('fractal-transformer')();

class PeerTransformer {

  peer = (data) => fractal(data, {
    'id': 'id',
    'peer_id': 'peer_id',
    'first_name': 'peer.first_name',
    'profile_picture': function (data) {
      return process.env.API_IMAGE_URL + '/avatar/' + data.get('peer.profile_picture');
    },
    'status': function (data) {
      return data.get('status');
    }
  });

  newMatch = (count, data) => { return {
    res: fractal(data, {
    'id': 'id',
    'peer_id': 'id',
    'first_name': 'first_name',
    'profile_picture': function (data) {
      return process.env.API_IMAGE_URL + '/avatar/' + data.get('profile_picture');
    },
    'health_categories': 'health_categories'}),
    'count': count
  }};

  search = (data) => fractal(data, {
    'id': 'id',
    'peer_id': 'id',
    'first_name': 'first_name',
    'profile_picture': function (data) {
      return process.env.API_IMAGE_URL + '/avatar/' + data.get('profile_picture');
    },
  });
}

module.exports = PeerTransformer;
