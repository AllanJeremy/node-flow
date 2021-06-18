require('dotenv').config();
const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');
const Op = Sequelize.Op;

/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');

const ElasticsearchEventsAction = require('../../../../helpers/ElasticsearchEventsAction');

var ElasticsearchEventsHandler = require('../../../../helpers/ElasticsearchEventsHandler');
ElasticsearchEventsHandler = new ElasticsearchEventsHandler();

/**
 * Models
 */
const Models = require('../../../../models');
const User = Models.User;
const UserMetadata = Models.UserMetadata;
const UserInterest = Models.UserInterest;
const Race = Models.Race;
const Gender = Models.Gender;
const SexualOrientation = Models.SexualOrientation;
const FamilyDynamic = Models.FamilyDynamic;
const HealthCategory = Models.HealthCategory;
const UserHealthCategory = Models.UserHealthCategory;
const Workout = Models.Workout;
const UserWorkout = Models.UserWorkout;
const UserRace = Models.UserRace;
const UserFamilyDynamic = Models.UserFamilyDynamic;
const PersonalityQuestion = Models.PersonalityQuestion;
const UserPersonalityQuestion = Models.UserPersonalityQuestion;
const ConversationStarter = Models.ConversationStarter;
const UserConversationStarter = Models.UserConversationStarter;
const UserMatchingPreference = Models.UserMatchingPreference;
const UserSetting = Models.UserSetting;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;


/**
 * Transformers
 */
var UserTransformer = require('../../../../transformers/front/UserTransformer');
UserTransformer = new UserTransformer();

class UserProfileController {


  /**
   * @api {post} /user/profile/basic Handles user profile store operation
   * @apiName Front user profile store operation
   * @apiGroup Front
   *
   * @apiParam {String} [first_name] email
   * @apiParam {String} [name_prefix] password
   * @apiParam {String} [birth_date] birth_date
   *
   * @apiSuccess (200) {Object}
   */
  store = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    User.findOne({
      where: {
        id: req.id
      }
    }).then(response => {
      User.update({
        first_name: req.body.first_name,
        name_prefix: req.body.name_prefix,
        birth_date: req.body.birth_date,
        profile_picture: req.body.profile_picture,
      },
      {
        where: {id: response.id},
        returning: true,
        raw: true
      })
      .then(response => {
        let res_data = response[1][0];
        let data = {
          id: req.id
        }

        ElasticsearchEventsHandler.store(ElasticsearchEventsAction.createUser, data);

        return ResponseHandler.success(res, responseLanguage.profile_create);
      })
      .catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      });
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {post} /user/profile/basic/store/summary Handles user profile store summary operation
   * @apiName Front user profile store summary operation
   * @apiGroup Front
   *
   * @apiParam {String} [summary] summary
   *
   * @apiSuccess (200) {Object}
   */
  update = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    UserMetadata.findOne({
      where: {
        user_id: req.id
      }
    }).then(response => {
      if (!response) {
        UserMetadata.create({
          user_id: req.id,
          summary: req.body.summary
        })
        .then(response => {
          return ResponseHandler.success(res, responseLanguage.profile_update);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        UserMetadata.update({
          summary: req.body.summary
        },{
          where: {user_id: req.id}
        })
        .then(response => {
          return ResponseHandler.success(res, responseLanguage.profile_update);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {post} /user/profile/interest Handles user profile interest option store operation
   * @apiName Front user profile interest option store operation
   * @apiGroup Front
   *
   * @apiParam {String} [interest] interest
   *
   * @apiSuccess (200) {Object}
   */
  userInterestStore = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    let userInterest = await UserInterest.findOne({
      where: { user_id: req.id}
    });

    if (!userInterest) {
      UserInterest.create({
        user_id: req.id,
        value: req.body.interest
      })
      .then(response => {
        return ResponseHandler.success(res, responseLanguage.user_interest_save);
      })
      .catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      });
    } else {
      UserInterest.update({
        value: req.body.interest
      },
      {
        where: { user_id: req.id }
      }
      )
      .then(response => {
        return ResponseHandler.success(res, responseLanguage.user_interest_save);
      })
      .catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      });
    }
  }


  /**
   * @api {post} /user/profile/visibility Handles user profile visibility store operation
   * @apiName Front user profile visibility store operation
   * @apiGroup Front
   *
   * @apiParam {Integer} [race_status] race_status
   * @apiParam {Integer} [gender_status] gender_status
   * @apiParam {Integer} [family_dynamic_status] family_dynamic_status
   * @apiParam {Integer} [sexual_orientation_status] sexual_orientation_status
   * @apiParam {Integer} [workouts_status] workouts_status array
   * @apiParam {Integer} [health_categories_status] health_categories_status
   *
   * @apiSuccess (200) {Object}
   */
  visibility = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    UserMetadata.findOne({
      where: {
        user_id: req.id
      }
    }).then(async response => {
      await UserMetadata.update({
        race_status: req.body.race_status,
        gender_status: req.body.gender_status,
        family_dynamic_status: req.body.family_dynamic_status,
        sexual_orientation_status: req.body.sexual_orientation_status,
        workout_status: req.body.workouts_status,
      },
      {
        where: { id: response.id }
      });


      let healthCategoriesStatus = req.body.health_categories_status ? req.body.health_categories_status : [];
      if(healthCategoriesStatus && healthCategoriesStatus.length > 0) {
        healthCategoriesStatus.map(async (item, index) => {
          await UserHealthCategory.update({
            status: StatusHandler.active
          },
          {
            where: {
              user_id: req.id,
              health_category_id: item
            }
          });
        });
      }
      UserHealthCategory.update({
        status: StatusHandler.pending
      },
      {
        where: {
          health_category_id: {[Op.notIn]: healthCategoriesStatus},
          user_id: req.id
        }
      });

      return ResponseHandler.success(res, responseLanguage.visibility);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {get} /user Handles user profile show operation
   * @apiName Front user profile profile show operation
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  show = (req, res) => {

    let userId = req.params.id ? req.params.id : req.id

    User.findOne({
      where: { id: userId },
      include: [
      {
        model: UserMetadata,
        attributes: ['gender_status', 'sexual_orientation_status', 'race_status', 'family_dynamic_status', 'workout_status', 'summary'],
        include: [
          { model: Gender, as:'gender', attributes: ['id', 'name', 'status'] },
          { model: SexualOrientation, as: 'sexual_orientation',  attributes: ['id', 'name', 'status'] }],
        as: 'user_meta_data'
      },
      {
        model: UserHealthCategory,
        attributes: ['id', 'status'],
        include: [{
            model: HealthCategory,
            attributes: ['id', 'name', 'status'],
            as: 'health_category'
          }],
        as: 'health_categories'
      },
      {
        model: UserWorkout,
        attributes: ['id', 'status'],
        include: [{
          model: Workout,
          attributes: ['id', 'name', 'status'],
          as: 'workout'
        }],
        as: 'workouts'
      },
      {
        model: UserRace,
        attributes: ['id', 'status'],
        include: [{
          model: Race,
          attributes: ['id', 'name', 'status'],
          as: 'race'
        }],
        as: 'races'
      },
      {
        model: UserFamilyDynamic,
        attributes: ['id', 'status'],
        include: [{
          model: FamilyDynamic,
          attributes: ['id', 'name', 'status'],
          as: 'family_dynamic',
        }],
        as: 'family_dynamics'
      },
      {
        model: UserPersonalityQuestion,
        attributes: ['id', 'user_id', 'question_id', 'answer'],
        include: [{
          model: PersonalityQuestion,
          attributes: ['id', 'question', 'options'],
          as: 'personality_question'
        }],
        as: 'personality_questions'
      },
      {
        model: UserConversationStarter,
          attributes: ['id', 'user_id', 'conversation_starter_id', 'answer', 'status'],
          include: [{
            model: ConversationStarter,
            attributes: ['id', 'question'],
            as: 'conversation_starter'
          }],
          as: 'conversation_starters'
      },
      {
        model: UserMatchingPreference,
          attributes: ['id', 'user_id', 'module'],
          as: 'user_matching_preferences'
      },
      {
        model: UserSetting,
        attributes: ['theme_color'],
        as: 'user_setting'
      },
      ]
    })
    .then(response => {
      return ResponseHandler.success(res, '', UserTransformer.UserDetail(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /user/change_password Handles change password operation
   * @apiName Change password
   * @apiGroup Front
   *
   * @apiParam {String} [current_password] current_password
   * @apiParam {String} [new_password] new_password
   *
   * @apiSuccess (200) {Object}
   */
  changePassword = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    User.findOne({
      where: {
        id: req.id
      }
    }).then(response => {
      var isPasswordValid = bcrypt.compareSync(
        req.body.current_password,
        response.password
      );

      if (!isPasswordValid) {
        return ResponseHandler.error(res, 422, responseLanguage.incorrect_current_password);
      }

      User.update({
          password: bcrypt.hashSync(req.body.new_password),
        }, {
          where: {
            id: req.id
          }
        })
        .then(response => {
          return ResponseHandler.success(res, 200, responseLanguage.password_changed_success);
        }).catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
    });
  }

  /**
   * @api {post} /user/matching_preference/store Handles user matching preference module store operation
   * @apiName Front user matching preference module store operation
   * @apiGroup Front
   *
   * @apiParam {String} [module] module
   *
   * @apiSuccess (200) {Object}
   */
  StoreMatchingPreference = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    req.body.module.map(async (item) => {
      var isModuleExist = await UserMatchingPreference.findOne({
        where: {
          user_id: req.id,
          module: item
        }
      });
      if(!isModuleExist) {
        await UserMatchingPreference.create({
          user_id: req.id,
          module: item
        });
      }
    });

    UserMatchingPreference.destroy({
      where: {
        module: {[Op.notIn]: req.body.module},
        user_id: req.id
      }
    });

    return ResponseHandler.success(res, responseLanguage.matching_preference_store);
  }

  /**
   * @api {get} /user/account/deactivate Handles user account deactivate operation
   * @apiName Front user account deactivate operation
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  AccountDeactivate = (req, res) => {
    User.findOne({
      where: {
        id: req.id
      }
    }).then(response => {
      User.update({
        status: StatusHandler.deactivate,
      },
      {
        where: { id: req.id }
      }).then(response => {
        return ResponseHandler.success(res, responseLanguage.account_deactivate_success);
      }).catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      });
    }).catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {get} /user/account/delete Handles user account delete operation
   * @apiName Front user account delete operation
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  AccountDelete = (req, res) => {
    User.findOne({
      where: {
        id: req.id
      }
    }).then(response => {
      User.destroy({
        where: { id: req.id }
      }).then(response => {
        return ResponseHandler.success(res, responseLanguage.account_delete_success);
      }).catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      });
    }).catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /user/settings/store Handles user settings store operation
   * @apiName Front user settings store operation
   * @apiGroup Front
   *
   * @apiParam {String} [theme_color] theme_color
   *
   * @apiSuccess (200) {Object}
   */
  settingStore = (req, res) => {
    UserSetting.findOne({
      where: {
        user_id: req.id
      }
    }).then(response => {
      if(!response) {
        UserSetting.create({
          user_id: req.id,
          theme_color: req.body.profile_color
        }).then(response => {
          return ResponseHandler.success(res, responseLanguage.setting_store_success);
        }).catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        UserSetting.update({
          theme_color: req.body.profile_color
        }, {
          where: { user_id: req.id }
        }).then(response => {
          return ResponseHandler.success(res, responseLanguage.setting_update_success);
        }).catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      }
    }).catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = UserProfileController;
