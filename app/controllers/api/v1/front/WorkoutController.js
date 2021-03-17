require('dotenv').config();
const { validationResult } = require('express-validator');


/**
 * Helpers
 */
var ResponseHandler = require('../../../../helpers/ResponseHandler');
ResponseHandler = new ResponseHandler();

const StatusHandler = require('../../../../helpers/StatusHandler');


/**
 * Models
 */
const Models = require('../../../../models');
const Workout = Models.Workout;
const WorkoutUser = Models.WorkoutUser;

/**
 * Languages
 */
const language = require('../../../../language/en_default');
const responseLanguage = language.en.front.response;
const validationLanguage = language.en.front.validation;

/**
 * Transformers
 */
var CommonTransformer = require('../../../../transformers/core/CommonTransformer');
CommonTransformer = new CommonTransformer();


class WorkoutController {

  /**
   * @api {get} /profile/workout/list Show workout list
   * @apiName Workout list
   * @apiGroup Front
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    Workout.findAll({
      where: {
        status: StatusHandler.active
      }
    , order: [['id', 'DESC']]})
    .then(response => {
      return ResponseHandler.success(res, '', CommonTransformer.transform(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {post} /profile/workout/store Handles user profile workout store operation
   * @apiName Front user profile workout store operation
   * @apiGroup Front
   *
   * @apiParam {String} [name] name
   *
   * @apiSuccess (200) {Object}
   */
  store = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    let workoutsName= req.body.name

    workoutsName.map(async(item, index) => {
      let isWorkoutExist = await Workout.findOne({
        where: {
          name: item
        }
      });

      if(!isWorkoutExist) {
        let workout = await Workout.create({
          name: item,
          status: StatusHandler.pending
        });
        this.update(req.id, workout.id);
      } else {
        this.update(req.id, isWorkoutExist.id);
      }
    });
    return ResponseHandler.success(res, responseLanguage.profile_update);
  }

  update = async(userId, workoutId) => {
    let isWorkoutUserExist = await WorkoutUser.findOne({
      where: {
        user_id: userId,
        workout_id: workoutId
      }
    });
    if(!isWorkoutUserExist) {
      await WorkoutUser.create({
        user_id: userId,
        workout_id: workoutId
      });
    }
  }

}

module.exports = WorkoutController;
