var fractal = require('fractal-transformer')();

class UserTransformer {

	AdminUser = (data) => fractal(data, {
		'id': 'id',
		'first_name': 'first_name',
		'last_name': 'last_name',
		'email': 'email',
		'status': function (data) {
      return data.get('status');
    }
	});

  AdminPermission = (data) => fractal(data, {
    'id': 'id',
    'admin_user_id': 'admin_user_id',
    'permissions': 'permissions'
  });

  AdminPermissionList = (data) => fractal(data, {
    'key': 'key',
    'value': 'value'
  });

  UserList = (data) => fractal(data, {
    'id': 'id',
    'email': 'email',
    'first_name': 'first_name',
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
      'id': 'UserDetail.id',
      'race': 'UserDetail.Race.name',
      'gender': 'UserDetail.Gender.name',
      'sexual_orientation': 'UserDetail.SexualOrientation.name',
      'family_dynamic': 'UserDetail.FamilyDynamic.name',
      'health_categories': data.health_categories.length > 0 ? fractal(data.health_categories, {
        "name": "health_category.name"
      }) : [],
      'workouts': data.workouts.length > 0 ? fractal(data.workouts, {
        "name": "workout.name"
      }) : [],
      'personality_questions': data.personality_questions.length > 0 ? fractal(data.personality_questions, {
          "question": "personality_question.question",
          "answer": "answer"
      }) : [],
      'summary': 'UserDetail.summary',
    }
  });
}

module.exports = UserTransformer;
