var fractal = require('fractal-transformer')();

class PeerTransformer {

  peer = (data) => fractal(data, {
    'id': 'id',
    'first_name': 'peer.first_name',
    'profile_picture': 'peer.profile_picture'
  });
}

module.exports = PeerTransformer;
