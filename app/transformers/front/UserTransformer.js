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

  UserDetail = (data) => fractal(data, {
    'id': 'id',
    'email': 'email',
    'name_prefix': 'name_prefix',
    'first_name': 'first_name',
    'birth_date': 'birth_date',
    'profile_picture': 'profile_picture',
    'status': function (data) {
      return data.get('status');
    },
    'user_detail': {
      'id': 'user_meta_data.id',
      'race': {
        'name': 'user_meta_data.Race.name',
        'status': function (data) {
          return data.get('user_meta_data.race_status');
        }
      },
      'gender': {
        'name': 'user_meta_data.Gender.name',
        'status': function (data) {
          return data.get('user_meta_data.gender_status');
        }
      },
      'sexual_orientation': {
        'name': 'user_meta_data.SexualOrientation.name',
        'status': function (data) {
          return data.get('user_meta_data.sexual_orientation_status');
        }
      },
      'family_dynamic': {
        'name': 'user_meta_data.FamilyDynamic.name',
        'status': function (data) {
          return data.get('user_meta_data.family_detail_status');
        }
      },
      'health_categories': data.health_categories.length > 0 ? fractal(data.health_categories, {
        'name': 'health_category.name',
        'status': function (data) {
          return data.get('status');
        }
      }) : [],
      'workouts': data.workouts.length > 0 ? fractal(data.workouts, {
        'name': 'workout.name',
        'status': function (data) {
          return data.get('status');
        }
      }) : [],
      'summary': 'user_meta_data.summary',
    }
  });
}

module.exports = UserTransformer;
