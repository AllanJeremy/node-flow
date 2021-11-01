var fractal = require("fractal-transformer")();

class UserTransformer {
  static AdminUser = (data) =>
    fractal(data, {
      id: "id",
      first_name: "first_name",
      last_name: "last_name",
      email: "email",
      status: function (data) {
        return data.get("status");
      },
    });

  static AdminPermission = (data) =>
    fractal(data, {
      id: "id",
      admin_user_id: "admin_user_id",
      permissions: "permissions",
    });

  static AdminPermissionList = (data) =>
    fractal(data, {
      key: "key",
      value: "value",
    });

  static UserList = (data) =>
    fractal(data, {
      id: "id",
      email: "email",
      first_name: "first_name",
      status: function (data) {
        return data.get("status");
      },
      list_status: function (data) {
        return data.get("hide_from_list") == undefined
          ? 0
          : data.get("hide_from_list")
          ? 1
          : 0;
      },
    });

  static UserDetail = (data) =>
    fractal(data, {
      id: "id",
      email: "email",
      name_prefix: "name_prefix",
      first_name: "first_name",
      birth_date: "birth_date",
      profile_picture: "profile_picture",
      status: function (data) {
        return data.get("status");
      },
      user_detail: {
        id: "user_meta_data.id",
        gender: "user_meta_data.Gender.name",
        sexual_orientation: "user_meta_data.SexualOrientation.name",
        races:
          data.races.length > 0
            ? fractal(data.races, {
                name: "race.name",
              })
            : [],
        family_dynamic:
          data.family_dynamics.length > 0
            ? fractal(data.family_dynamics, {
                name: "family_dynamic.name",
              })
            : [],
        health_categories:
          data.health_categories.length > 0
            ? fractal(data.health_categories, {
                name: "health_category.name",
              })
            : [],
        workouts:
          data.workouts.length > 0
            ? fractal(data.workouts, {
                name: "workout.name",
              })
            : [],
        personality_questions:
          data.personality_questions.length > 0
            ? fractal(data.personality_questions, {
                question: "personality_question.question",
                options: "personality_question.options",
                answer: "answer",
              })
            : [],
        conversation_starters:
          data.conversation_starters.length > 0
            ? fractal(data.conversation_starters, {
                question: "conversation_starter.question",
                answer: "answer",
              })
            : [],
        summary: "user_meta_data.summary",
      },
    });
}

module.exports = UserTransformer;
