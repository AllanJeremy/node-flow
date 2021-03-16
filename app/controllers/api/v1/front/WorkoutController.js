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

    let workoutName= req.body.name

    workoutName.map((item, index) => {
      Workout.findOne({
        where: {
          name: item
        }
      }).then(response => {
        if (!response) {
          Workout.create({
            name: item,
            status: StatusHandler.pending
          })
          .then(response => {
            this.update(res, req.id, response.id);
          })
          .catch(err => {
            return ResponseHandler.error(res, 500, err.message);
          })
        } else {
          this.update(res, req.id, response.id);
        }
      })
      .catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      });
    });
  }

  update = (res, userId, workoutId) => {
    WorkoutUser.create({
      user_id: userId,
      workout_id: workoutId
    })
    .then(response => {
      return ResponseHandler.success(res, responseLanguage.profile_update);
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

}

module.exports = WorkoutController;
