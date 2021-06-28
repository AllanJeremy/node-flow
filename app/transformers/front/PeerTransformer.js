var fractal = require('fractal-transformer')();

class PeerTransformer {

  peer = (data) => fractal(data, {
    'id': 'id',
    'peer_id': 'peer_id',
    'first_name': 'peer.first_name',
    'profile_picture': function (data) {
      return process.env.API_IMAGE_URL + '/avatar/' + data.get('peer.profile_picture');
    },
  });

  newMatch = (count, data) => { console.log(count); return {
    res: fractal(data, {
    'id': 'res.id',
    'first_name': function (data) {
      //console.log("testttt", data.get('res'), data.get('res').User);
      var data1 = data.get('res');
      return function (data1) {
        console.log("daaaaa", data1.get('first_name'));
        return data1.get('first_name')  ;
      }
    },
    'profile_picture': function (data) {
      return process.env.API_IMAGE_URL + '/avatar/' + data.get('profile_picture');
    },
    'health_categories': 'health_categories'}),
    'count': count
  }};
}

module.exports = PeerTransformer;
