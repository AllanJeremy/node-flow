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
    , order: [['name', 'ASC']]})
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

    let workouts = req.body.workouts;

    const Op = Sequelize.Op;

    UserWorkout.destroy({
      where: {
        workout_id: {[Op.notIn]: workouts},
        user_id: req.id
      }
    });

    workouts && workouts.length > 0 && workouts.map(async(item, index) => {
      this.update(req.id, item, req.body.status);
    });


    if (req.body.other && req.body.other.length > 0) {
      var otherWorkouts = [];
      req.body.other.map(async (item) => {
        let isUserOtherWorkoutExist = await UserWorkout.findOne({
          where: {
            user_id: req.id
          },
          include: [{
            model: Workout,
            attributes: ['id', 'name'],
            as: 'workout',
            where: { name: item }
          }],
          returning: true,
          raw: true
        });
        if(!isUserOtherWorkoutExist) {
          Workout.create({
            name: item,
            status: StatusHandler.pending
          },
          {
            returning: true,
            raw:true
          })
          .then(response => {
            otherWorkouts.push(response.id);
            this.update(req.id, response.id, StatusHandler.pending);
          });
        } else {
          otherWorkouts.push(isUserWorkoutExist.id);
        }
      });
    }

    return ResponseHandler.success(res, responseLanguage.workout_save);
  }

  update = async(userId, workoutId, status) => {
    let isUserWorkoutExist = await UserWorkout.findOne({
      where: {
        user_id: userId,
        workout_id: workoutId
      }
    });
    if (!isUserWorkoutExist) {
      UserWorkout.create({
        user_id: userId,
        workout_id: workoutId,
        status: status
      }).then(response => {
        if (status == StatusHandler.active) {
          this.updateElaticsearch(userId);
        }
      });
    } else {
      UserWorkout.update({
        status: status
      }, {
        where: {
          user_id: userId,
          workout_id: workoutId,
        }
      }).then(response => {
        if (status == StatusHandler.active) {
          this.updateElaticsearch(userId);
        }
      });
    }
  }

  updateElaticsearch = (userId) => {
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
    }).catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = WorkoutController;
