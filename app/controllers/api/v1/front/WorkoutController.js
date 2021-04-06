require('dotenv').config();
const { validationResult } = require('express-validator');


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
   * @apiParam {Array} [workouts] workouts
   *
   * @apiSuccess (200) {Object}
   */
  store = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    let workouts= req.body.workouts

    workouts && workouts.length > 0 && workouts.map(async(item, index) => {
      this.update(req.id, item);

    });
    if (req.body.other) {
      let workout = await Workout.create({
        name: req.body.other,
        status: StatusHandler.pending
      });
      this.update(req.id, workout.id);
    }
    return ResponseHandler.success(res, responseLanguage.workout_save);
  }

  update = async(userId, workoutId) => {
    let isUserWorkoutExist = await UserWorkout.findOne({
      where: {
        user_id: userId,
        workout_id: workoutId
      }
    });
    if (!isUserWorkoutExist) {
      UserWorkout.create({
        user_id: userId,
        workout_id: workoutId
      }).then(response => {
        UserWorkout.findAll({
          where: {
            user_id: userId
          },
          include: [{
            model: Workout,
            attributes: ['name'],
            as: 'workout',
            where: { status: StatusHandler.active }
          }],
          raw: true
        }).then(response => {
          if (response && response.length > 0) {
            let workouts = response.map(item => item['workout.name']);
            let data = {
              id: userId,
              name: workouts
            }
            ElasticsearchEventsHandler.store(ElasticsearchEventsAction.workoutUpdate, data);
          }
        });
      });
    }
  }

}

module.exports = WorkoutController;
