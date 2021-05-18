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
    'profile_picture': function (data) {
      return process.env.API_IMAGE_URL + '/avatar/' + data.get('profile_picture');
    },
    'status': function (data) {
      return data.get('status');
    },
    'user_detail': {
      'races': data.races.length > 0 ? fractal(data.races, {
        'id': 'race.id',
        'name': 'race.name',
        'status': function (data) {
          return data.get('status');
        }
      }) : [],
      'gender': {
        'id': 'user_meta_data.gender.id',
        'name': 'user_meta_data.gender.name',
        'status': function (data) {
          return data.get('user_meta_data.gender_status');
        }
      },
      'sexual_orientation': {
        'id': 'user_meta_data.sexual_orientation.id',
        'name': 'user_meta_data.sexual_orientation.name',
        'status': function (data) {
          return data.get('user_meta_data.sexual_orientation_status');
        }
      },
      'family_dynamic': data.family_dynamics.length > 0 ? fractal(data.family_dynamics, {
        'id': 'family_dynamic.id',
        'name': 'family_dynamic.name',
        'status': function (data) {
          return data.get('status');
        }
      }) : [],
      'health_categories': data.health_categories.length > 0 ? fractal(data.health_categories, {
        'id': 'health_category.id',
        'name': 'health_category.name',
        'status': function (data) {
          return data.get('status');
        }
      }) : [],
      'workouts': data.workouts.length > 0 ? fractal(data.workouts, {
        'id': 'workout.id',
        'name': 'workout.name',
        'status': function (data) {
          return data.get('status');
        }
      }) : [],
      'personality_questions': data.personality_questions.length > 0 ? fractal(data.personality_questions, {
        'id': 'personality_question.id',
        'question': 'personality_question.question',
        'options': 'personality_question.options',
        'answer': 'answer'
      }) : [],
      'conversation_starters': data.conversation_starters.length > 0 ? fractal(data.conversation_starters, {
        'question': 'conversation_starter.question',
        'answer': 'answer'
      }) : [],
      'summary': 'user_meta_data.summary',
    }
  });
}

module.exports = UserTransformer;
