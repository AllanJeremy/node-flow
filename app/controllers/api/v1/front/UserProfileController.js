require('dotenv').config();
const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');


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
        workout_status: req.body.workout_status
      },
      {
        where: { id: response.id }
      });

      const Op = Sequelize.Op;
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
        attributes: ['gender_status', 'sexual_orientation_status', 'race_status', 'family_dynamic_status', 'workout_status','summary'],
        include: [
          { model: Gender, as:'gender', attributes: ['id', 'name'] },
          { model: SexualOrientation, as: 'sexual_orientation',  attributes: ['id', 'name'] }],
        as: 'user_meta_data'
      },
      {
        model: UserHealthCategory,
        attributes: ['id', 'status'],
        include: [{
            model: HealthCategory,
            attributes: ['id', 'name'],
            as: 'health_category',
            where: { status: StatusHandler.active }
          }],
        as: 'health_categories'
      },
      {
        model: UserWorkout,
        attributes: ['id', 'status'],
        include: [{
          model: Workout,
          attributes: ['id', 'name'],
          as: 'workout',
          where: { status: StatusHandler.active }
        }],
        as: 'workouts'
      },
      {
        model: UserRace,
        attributes: ['id', 'status'],
        include: [{
          model: Race,
          attributes: ['id', 'name'],
          as: 'race',
          where: { status: StatusHandler.active }
        }],
        as: 'races'
      },
      {
        model: UserFamilyDynamic,
        attributes: ['id', 'status'],
        include: [{
          model: FamilyDynamic,
          attributes: ['id', 'name'],
          as: 'family_dynamic',
          where: { status: StatusHandler.active }
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
        attributes: ['id', 'user_id', 'conversation_starter_id', 'answer'],
        include: [{
          model: ConversationStarter,
          attributes: ['question'],
          as: 'conversation_starter'
        }],
        as: 'conversation_starters'
      }
      ]
    })
    .then(response => {
      return ResponseHandler.success(res, '', UserTransformer.UserDetail(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = UserProfileController;
