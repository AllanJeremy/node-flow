var fractal = require('fractal-transformer')();
const Pronouns = require('../../models/Pronouns');

class UserTransformer {

  user = (data) => fractal(data, {
    'id': 'id',
    'name_prefix': 'name_prefix',
    'first_name': 'first_name',
    'last_name': 'last_name',
    'email': 'email',
    'birth_date': 'birth_date',
    'profile_picture': 'profile_picture',
    'published': 'published',
    'chat_token': 'chat_token',
    'status': function (data) {
      return data.get('status');
    }
  });

  UserDetail = (data) => fractal(data, {
    'id': 'id',
    'email': 'email',
    'name_prefix_text': function (data) {
      var prefix = data.get('name_prefix');
      var PronounsModel = new Pronouns();
      var pronouns = PronounsModel.pronouns;
      var prefixText;
      pronouns.map((item, index) => {
        if(item[prefix]) {
          prefixText = item[prefix];
        }
      })
      return prefixText;
    },
    'name_prefix': 'name_prefix',
    'first_name': 'first_name',
    'birth_date': 'birth_date',
    'published': 'published',
    'chat_token': 'chat_token',
    'profile_picture': function (data) {
      return process.env.API_IMAGE_URL + '/avatar/' + data.get('profile_picture');
    },
    'status': function (data) {
      return data.get('status');
    },
    'user_detail': {
      'profile_color': 'user_setting.theme_color',
      'user_races': {
        'races' : data.races && data.races.length > 0 ? fractal(data.races, {
          'id': 'race.id',
          'name': 'race.name',
          'is_other': function (data) {
            return data.get('race.status');
          },
        }) : [],
        'status': function (data) {
          return data.get('user_meta_data.race_status');
        }
      },
      'gender': {
        'id': 'user_meta_data.gender.id',
        'name': 'user_meta_data.gender.name',
        'is_other': function (data) {
          return data.get('user_meta_data.gender.status');
        },
        'status': function (data) {
          return data.get('user_meta_data.gender_status');
        }
      },
      'sexual_orientation': {
        'id': 'user_meta_data.sexual_orientation.id',
        'name': 'user_meta_data.sexual_orientation.name',
        'is_other': function (data) {
          return data.get('user_meta_data.sexual_orientation.status');
        },
        'status': function (data) {
          return data.get('user_meta_data.sexual_orientation_status');
        }
      },
      'user_family_dynamics': {
        'family_dynamics': data.family_dynamics.length > 0 ? fractal(data.family_dynamics, {
          'id': 'family_dynamic.id',
          'name': 'family_dynamic.name',
          'is_other': function (data) {
            return data.get('family_dynamic.status');
          },
        }) : [],
        'status': function (data) {
          return data.get('user_meta_data.family_dynamic_status');
        }
      },
      'health_categories': data.health_categories.length > 0 ? fractal(data.health_categories, {
        'id': 'health_category.id',
        'name': 'health_category.name',
        'is_other': function (data) {
          return data.get('health_category.status');
        },
        'status': function (data) {
          return data.get('status');
        },
      }) : [],
      'user_workouts': {
        'workouts' : data.workouts.length > 0 ? fractal(data.workouts, {
          'id': 'workout.id',
          'name': 'workout.name',
          'is_other': function (data) {
            return data.get('workout.status');
          },
        }) : [],
        'status': function (data) {
          return data.get('user_meta_data.workout_status');
        }
      },
      'personality_questions': data.personality_questions.length > 0 ? fractal(data.personality_questions, {
        'id': 'personality_question.id',
        'question': 'personality_question.question',
        'options': 'personality_question.options',
        'answer': 'answer'
      }) : [],
      'conversation_starters': data.conversation_starters.length > 0 ? fractal(data.conversation_starters, {
        'id': 'conversation_starter.id',
        'question': 'conversation_starter.question',
        'question_icon': 'conversation_starter.question_icon',
        'answer': 'answer',
        'status': 'status'
      }) : [],
      'matching_preference': data.user_matching_preferences.length > 0 ? fractal(data.user_matching_preferences, {
        'id': 'id',
        'module': 'module'
      }) : [],
      'summary': 'user_meta_data.summary',
      'listed_peers': data.listed_peers && data.listed_peers.length > 0 ? fractal(data.listed_peers, {
        'peer_id': 'peer_id'
      }) : []
    }
  });
}

module.exports = UserTransformer;
