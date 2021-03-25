require('dotenv').config();
const { validationResult } = require('express-validator');


/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

/**
 * Models
 */
const Models = require('../../../../models');
const User = Models.User;
const UserMetaData = Models.UserMetaData;
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
        where: {id: response.id}
      })
      .then(response => {
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

    UserMetaData.findOne({
      where: {
        user_id: req.id
      }
    }).then(response => {
      if(!response) {
        UserMetaData.create({
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
        UserMetaData.update({
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

    UserMetaData.findOne({
      where: {
        user_id: req.id
      }
    }).then(async response => {
      await UserMetaData.update({
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
        model: UserMetaData,
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
