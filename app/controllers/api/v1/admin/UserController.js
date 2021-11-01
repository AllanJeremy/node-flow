const { validationResult } = require("express-validator");

/**
 * Helpers
 */
const {
  ElasticSearchHandler,
  ResponseHandler,
} = require("../../../../helpers");

/**
 * Models
 */
const {
  User,
  UserMetadata,
  Race,
  Gender,
  SexualOrientation,
  FamilyDynamic,
  HealthCategory,
  UserHealthCategory,
  Workout,
  UserWorkout,
  PersonalityQuestion,
  UserPersonalityQuestion,
  ConversationStarter,
  UserConversationStarter,
  UserRace,
  UserFamilyDynamic,
} = require("../../../../models");

/**
 * Languages
 */
const language = require("../../../../language/en_default");
const responseLanguage = language.en.admin.response;
const validationLanguage = language.en.admin.validation;

/**
 * Transformers
 */
const { UserTransformer } = require("../../../../transformers/admin");

class UserController {
  /**
   * @api {get} /admin/user/list Show user list
   * @apiName User list
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    User.findAll({
      order: [["id", "DESC"]],
      attributes: ["id", "email", "first_name", "hide_from_list", "status"],
    })
      .then((response) => {
        return ResponseHandler.success(
          res,
          "",
          UserTransformer.UserList(response)
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {get} /admin/user/show/:id Show user detail
   * @apiName Show user detail
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  show = (req, res) => {
    User.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: UserMetadata,
          attributes: [
            "gender_status",
            "sexual_orientation_status",
            "race_status",
            "family_dynamic_status",
            "workout_status",
            "summary",
          ],
          include: [
            {
              model: Gender,
              as: "gender",
              attributes: ["id", "name", "status"],
            },
            {
              model: SexualOrientation,
              as: "sexual_orientation",
              attributes: ["id", "name", "status"],
            },
          ],
          as: "user_meta_data",
        },
        {
          model: UserRace,
          attributes: ["id", "user_id", "race_id"],
          include: [
            {
              model: Race,
              attributes: ["name"],
              as: "race",
            },
          ],
          as: "races",
        },
        {
          model: UserHealthCategory,
          attributes: ["id", "user_id", "health_category_id"],
          include: [
            {
              model: HealthCategory,
              attributes: ["name"],
              as: "health_category",
            },
          ],
          as: "health_categories",
        },
        {
          model: UserFamilyDynamic,
          attributes: ["id", "user_id", "family_dynamic_id"],
          include: [
            {
              model: FamilyDynamic,
              attributes: ["name"],
              as: "family_dynamic",
            },
          ],
          as: "family_dynamics",
        },
        {
          model: UserWorkout,
          attributes: ["id", "user_id", "workout_id"],
          include: [
            {
              model: Workout,
              attributes: ["name"],
              as: "workout",
            },
          ],
          as: "workouts",
        },
        {
          model: UserPersonalityQuestion,
          attributes: ["id", "user_id", "question_id", "answer"],
          include: [
            {
              model: PersonalityQuestion,
              attributes: ["id", "question", "options"],
              as: "personality_question",
            },
          ],
          as: "personality_questions",
        },
        {
          model: UserConversationStarter,
          attributes: ["id", "user_id", "conversation_starter_id", "answer"],
          include: [
            {
              model: ConversationStarter,
              attributes: ["question"],
              as: "conversation_starter",
            },
          ],
          as: "conversation_starters",
        },
      ],
    })
      .then((response) => {
        return ResponseHandler.success(
          res,
          "",
          UserTransformer.UserDetail(response)
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {post} /admin/user/update/status Update user status
   * @apiName Update user status
   * @apiGroup Admin
   *
   * @apiParam {Integer} [user_id] user_id
   * @apiParam {Integer} [status] status
   *
   * @apiSuccess (200) {Object}
   */
  updateStatus = (req, res) => {
    User.findOne({
      where: { id: req.body.user_id },
    })
      .then((response) => {
        User.update(
          {
            status: req.body.status,
          },
          {
            where: { id: response.id },
          }
        );
        return ResponseHandler.success(
          res,
          responseLanguage.user_status_change
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   * @api {post} /admin/user/list/status Update user listing status
   * @apiName Update user listing status
   * @apiGroup Admin
   *
   * @apiParam {Integer} [user_id] user_id
   * @apiParam {Integer} [status] status
   *
   * @apiSuccess (200) {Object}
   */
  listStatus = (req, res) => {
    User.findOne({
      where: { id: req.body.user_id },
    })
      .then((response) => {
        User.update(
          {
            hide_from_list: req.body.status,
          },
          {
            where: { id: req.body.user_id },
          }
        )
          .then(async (res) => {
            if (req.body.status == 0) {
              await ElasticSearchHandler.updateDocumentField(req.body.user_id, {
                hide_from_list: true,
              });
            } else {
              await ElasticSearchHandler.deleteFieldById(
                req.body.user_id,
                "hide_from_list"
              );
            }
          })
          .catch((err) => {});
        return ResponseHandler.success(
          res,
          responseLanguage.user_status_change
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };
}

module.exports = UserController;
