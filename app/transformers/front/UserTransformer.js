var fractal = require('fractal-transformer')();

class UserTransformer {

  user = (data) => fractal(data, {
    'id': 'id',
    'name_prefix': 'name_prefix',
    'first_name': 'first_name',
    'last_name': 'last_name',
    'email': 'email',
    'birth_date': 'birth_date',
    'profile_picture': 'profile_picture',
    'status': function (data) {
      return data.get('status');
    }
  });
}

module.exports = UserTransformer;
