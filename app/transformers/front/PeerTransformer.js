var fractal = require('fractal-transformer')();

class PeerTransformer {

  peer = (data) => fractal(data, {
    'id': 'id',
    'first_name': 'peer.first_name',
    'profile_picture': 'peer.profile_picture'
  });

  newMatch = (data) => fractal(data, {
    'id': 'id',
    'first_name': function (data) {
      console.log("data", data.get('health_categories').length);
      return data.get('first_name')  ;
    },
    'profile_picture': function (data) {
      return process.env.API_IMAGE_URL + '/avatar/' + data.get('profile_picture');
    },
    'health_categories': data.health_categories && data.health_categories.length > 0 ? fractal(data.health_categories, {
        'id': 'health_category.id',
        'name': 'health_category.name',
        'is_other': function (data) {
          return data.get('health_category.status');
        },
        'status': function (data) {
          return data.get('status');
        },
      }) : [],
  });
}

module.exports = PeerTransformer;
