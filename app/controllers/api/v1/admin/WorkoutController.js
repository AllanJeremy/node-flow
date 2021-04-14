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
const responseLanguage = language.en.admin.response;
const validationLanguage = language.en.admin.validation;

/**
 * Transformers
 */
var CommonTransformer = require('../../../../transformers/core/CommonTransformer');
CommonTransformer = new CommonTransformer();


class WorkoutController {

  /**
   * @api {get} /admin/workout/list Handles workout list
   * @apiName Workout list
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  list = (req, res) => {
    Workout.findAll({order: [['id', 'DESC']]})
    .then(response => {
      return ResponseHandler.success(res, '', CommonTransformer.transform(response));
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }


  /**
   * @api {post} /admin/workout/store Handles workout store operation
   * @apiName Workout store
   * @apiGroup Admin
   *
   * @apiParam {String} [name] name
   * @apiParam {String} [status] status
   *
   * @apiSuccess (200) {Object}
   */
  store = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, validationLanguage.required_fields, errors.array());
    }

    Workout.findOne({
      where: {
        name: req.body.name
      }
    }).then(response => {
      if (!response) {
        Workout.create({
          name: req.body.name,
          status: req.body.status
        })
        .then(response => {
          return ResponseHandler.success(
            res, responseLanguage.workout_store_success, CommonTransformer.transform(response));
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        })
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.workout_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {patch} /admin/workout/update Handles workout update operation
   * @apiName Workout update
   * @apiGroup Admin
   *
   * @apiParam {String} [name] name
   * @apiParam {String} [status] status
   *
   * @apiSuccess (200) {Object}
   */
  update = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHandler.error(res, 422, errors.array());
    }

    Workout.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        Workout.update({
          name: req.body.name,
          status: req.body.status,
        },
        {
          where: { id: req.params.id },
          returning: true
        })
        .then(result => {

          if(response.name != req.body.name) {
            let data = {
              old_name: response.name,
              name: req.body.name
            }
            ElasticsearchEventswHandler.store(ElasticsearchEventswAction.workoutRenamed, data);
          }

          return ResponseHandler.success(
            res, responseLanguage.workout_update_success, CommonTransformer.transform(result));
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.not_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {delete} /admin/workout/destroy Handles workout destroy operation
   * @apiName Workout destroy
   * @apiGroup Admin
   *
   * @apiParam {Integer} [id] id
   *
   * @apiSuccess (200) {Object}
   */
  destroy = (req, res) => {
    Workout.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(response => {
      if (response) {
        let name = response.name;

        Workout.destroy({ where: { id: req.params.id } })
        .then(response => {

          UserWorkout.destroy({
            where: { workout_id: req.params.id }
          });

          let data = {
            name: name
          }
          ElasticsearchEventswHandler.store(ElasticsearchEventswAction.workoutDelete, data);

          return ResponseHandler.success(res, responseLanguage.workout_delete_success);
        })
        .catch(err => {
          return ResponseHandler.error(res, 500, err.message);
        });
      } else {
        return ResponseHandler.error(res, 400, responseLanguage.not_exist);
      }
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }

  /**
   * @api {post} /admin/workout/merge Merge workout
   * @apiName Merge workout
   * @apiGroup Admin
   *
   *
   * @apiSuccess (200) {Object}
   */
  merge = (req, res) => {
    Workout.findOne({
      where: {
        id: req.body.id
      }
    })
    .then(response => {
      UserWorkout.update({
          workout_id: req.body.merged_id,
        },
        {
        where: { workout_id: req.body.id },
        returning: true,
        plain: true
      })
      .then(response => {

        UserWorkout.findAll({
          where: {
            user_id: response[1].dataValues.user_id
          },
          include: [{
            model: Workout,
            attributes: ['name'],
            as: 'workout',
            where: { status: StatusHandler.active }
          }],
          raw: true
        }).then(result => {
          if (result && result.length > 0) {
            let workouts = result.map(item => item['workout.name']);
            let data = {
              id: response[1].dataValues.user_id,
              name: workouts
            }
            ElasticsearchEventswHandler.store(ElasticsearchEventswAction.workoutUpdate, data);
          }
        });

        Workout.destroy({ where: { id: req.body.id }, force: true });
        return ResponseHandler.success(res, responseLanguage.workout_merge_success);
      })
      .catch(err => {
        return ResponseHandler.error(res, 500, err.message);
      });
    })
    .catch(err => {
      return ResponseHandler.error(res, 500, err.message);
    });
  }
}

module.exports = WorkoutController;
