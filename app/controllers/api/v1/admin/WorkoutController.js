const { validationResult } = require('express-validator');

var APIResponse = require('../../../../helper/APIResponse');
APIResponse = new APIResponse();

const language = require('../../../../language/en_default');
const responseLanguage = language.en.admin.response;

var CommonTransformer = require('../../../../transformers/core/CommonTransformer');
CommonTransformer = new CommonTransformer();

const db = require('../../../../models');
const Workout = db.workout;

class WorkoutController {

	/**
	 * Show workout list.
	 *
	 * @param Object req
	 * @return Object res
	 */
	list = (req, res) => {
		Workout.findAll()
    .then(workout => {
    	var data = CommonTransformer.transform(workout);

      return APIResponse.success("", res, data);
    })
    .catch(err => {

      return APIResponse.error(500, err.message, res);
    });
	}


	/**
	 * Store a newly created workout in storage.
	 *
	 * @param Object req
	 * @return Object res
	 */
	store = (req, res) => {
		const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return APIResponse.error(422, errors.array(), res);
    }

    Workout.findOne({
	    where: {
	      name: req.body.name
	    }
	  }).then(workout => {
  		if(!workout) {
		    Workout.create({
			    name: req.body.name,
			    status: req.body.status
			  })
		    .then(workout => {

		      return APIResponse.success(responseLanguage.workout_store_success, res, []);
		    })
		    .catch(err => {

		      return APIResponse.error(500, err.message, res);
		    })
		  } else {

		  	return APIResponse.error(400, responseLanguage.workout_exist, res);
		  }
		})
	  .catch(err => {

      return APIResponse.error(500, err.message, res);
    });
	}

	/**
	 * Update workout by id.
	 *
	 * @param Object req
	 * @return Object res
	 */
	update = (req, res) => {
		const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return APIResponse.error(422, errors.array(), res);
    }

    Workout.findOne({
	    where: {
	    	id: req.params.id
	    }
	  })
    .then(workout => {
    	if (workout) {
	      Workout.update({
	        name: req.body.name,
	        status: req.body.status,
	      },
	      { where: { id: req.params.id } })
	      .then(workout => {

	      	return APIResponse.success(responseLanguage.workout_update_success, res, []);
	      })
	      .catch(err => {

		      return APIResponse.error(500, err.message, res);
		    });
	    } else {

		  	return APIResponse.error(400, responseLanguage.not_exist, res);
		  }
    })
    .catch(err => {

      return APIResponse.error(500, err.message, res);
    });
	}

	/**
	 * Delete workout by id.
	 *
	 * @param Object req
	 * @return Object res
	 */
	destroy = (req, res) => {
    Workout.findOne({
	    where: {
	    	id: req.params.id
	    }
	  })
    .then(workout => {
    	if (Workout) {
	      Workout.destroy({ where: { id: req.params.id } })
	      .then(workout => {

	      	return APIResponse.success(responseLanguage.workout_delete_success, res);
	      })
	      .catch(err => {

		      return APIResponse.error(500, err.message, res);
		    });
	    } else {

		  	return APIResponse.error(400, responseLanguage.not_exist, res);
		  }
    })
    .catch(err => {

      return APIResponse.error(500, err.message, res);
    });
	}
}

module.exports = WorkoutController;