require('dotenv').config();
const { validationResult } = require('express-validator');


/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

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
  userInterestStore = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

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
   * @apiParam {Integer} [workouts_status] workouts_status
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
        family_detail_status: req.body.family_dynamic_status,
        sexual_orientation_status: req.body.sexual_orientation_status,
      },
      {
        where: { id: response.id }
      });


      let workoutStatus = req.body.workouts_status;

      workoutStatus.map(async (item, index) => {
        await UserWorkout.update({
          status: item.status
        },
        {
          where: {
            user_id: req.id,
            workout_id: item.id
          }
        });
      });

      let healthCategoryStatus = req.body.health_categories_status;

      healthCategoryStatus.map(async (item, index) => {
        await UserHealthCategory.update({
          status: item.status
        },
        {
          where: {
            user_id: req.id,
            health_category_id: item.id
          }
        });
      });

      // store user settings in active search table
      User.findOne({
        where: { id: req.id },
        include: [
        {
          model: UserMetadata,
          include: [
            { model: Race, attributes: ['name'] },
            { model: Gender, attributes: ['name'] },
            { model: SexualOrientation, attributes: ['name'] },
            { model: FamilyDynamic, attributes: ['name'] }],
          as: 'user_meta_data'
        },
        {
          model: UserHealthCategory,
          attributes: ['id', 'health_category_id', 'status'],
          include: [{
              model: HealthCategory,
              attributes: ['name'],
              as: 'health_category'
            }],
          as: 'health_categories'
        },
        {
          model: UserWorkout,
          attributes: ['id', 'workout_id', 'status'],
          include: [{
            model: Workout,
            attributes: ['name'],
            as: 'workout'
          }],
          as: 'workouts'
        }]
      })
      .then(response => {

        let workouts = [];
        response.workouts.map((item, index) => {
          let isActive = workoutStatus.filter(workoutItem => (workoutItem.id == item.workout_id))[0].status;
          if(item.workout && item.workout.name && isActive == 1) {
            workouts.push(item.workout.name);
          }
        });

        let healthCategories = [];
        response.health_categories.map((item, index) => {
          let isActive = healthCategoryStatus.filter(healthCategoryItem => (healthCategoryItem.id == item.health_category_id))[0].status;
          if(item.health_category && item.health_category.name && isActive == 1) {
            healthCategories.push(item.health_category.name);
          }
        });

        let userData = {id: req.id};
        if(req.body.race_status == 1 && response.user_meta_data.Race) {
          userData.race = response.user_meta_data.Race.name;
        }
        if(req.body.gender_status == 1 && response.user_meta_data.Gender) {
          userData.gender = response.user_meta_data.Gender.name;
        }
        if(req.body.family_dynamic_status == 1 && response.user_meta_data.FamilyDynamic) {
          userData.family_dynamic = response.user_meta_data.FamilyDynamic.name;
        }
        if(req.body.sexual_orientation_status == 1 && response.user_meta_data.SexualOrientation) {
          userData.sexual_orientation = response.user_meta_data.SexualOrientation.name;
        }
        if(workouts.length > 0) {
          userData.workouts = workouts;
        }
        if(healthCategories.length > 0) {
          userData.health_categories = healthCategories;
        }

        ElasticsearchEventsHandler.store(ElasticsearchEventsAction.userVisibility, userData);

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
        include: [
          { model: Race, attributes: ['name'] },
          { model: Gender, attributes: ['name'] },
          { model: SexualOrientation, attributes: ['name'] },
          { model: FamilyDynamic, attributes: ['name'] }],
        as: 'user_meta_data'
      },
      {
        model: UserHealthCategory,
        attributes: ['id', 'status'],
        include: [{
            model: HealthCategory,
            attributes: ['name'],
            as: 'health_category'
          }],
        as: 'health_categories'
      },
      {
        model: UserWorkout,
        attributes: ['id', 'status'],
        include: [{
          model: Workout,
          attributes: ['name'],
          as: 'workout'
        }],
        as: 'workouts'
      }]
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
