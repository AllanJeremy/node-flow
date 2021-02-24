const { validationResult } = require('express-validator');

var APIResponse = require('../../../../helper/APIResponse');
APIResponse = new APIResponse();

const language = require('../../../../language/en_default');
const responseLanguage = language.en.admin.response;

var CommonTransformer = require('../../../../transformers/core/CommonTransformer');
CommonTransformer = new CommonTransformer();

const db = require('../../../../models');
const Race = db.race;

class RaceController {

	/**
	 * Show race list.
	 *
	 * @param Object req
	 * @return Object res
	 */
	list = (req, res) => {
		Race.findAll()
    .then(race => {
    	var data = CommonTransformer.transform(race);

      return APIResponse.success("", res, data);
    })
    .catch(err => {

      return APIResponse.error(500, err.message, res);
    });
	}


	/**
	 * Store a newly created race in storage.
	 *
	 * @param Object req
	 * @return Object res
	 */
	store = (req, res) => {
		const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return APIResponse.error(422, errors.array(), res);
    }

    Race.findOne({
	    where: {
	      name: req.body.name
	    }
	  }).then(race => {
  		if(!race) {
		    Race.create({
			    name: req.body.name,
			    status: req.body.status
			  })
		    .then(race => {

		      return APIResponse.success(responseLanguage.race_store_success, res, []);
		    })
		    .catch(err => {

		      return APIResponse.error(500, err.message, res);
		    })
		  } else {

		  	return APIResponse.error(400, responseLanguage.race_exist, res);
		  }
		})
	  .catch(err => {

      return APIResponse.error(500, err.message, res);
    });
	}

	/**
	 * Update race by id.
	 *
	 * @param Object req
	 * @return Object res
	 */
	update = (req, res) => {
		const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return APIResponse.error(422, errors.array(), res);
    }

    Race.findOne({
	    where: {
	    	id: req.params.id
	    }
	  })
    .then(race => {
    	if (race) {
	      Race.update({
	        name: req.body.name,
	        status: req.body.status,
	      },
	      { where: { id: req.params.id } })
	      .then(race => {

	      	return APIResponse.success(responseLanguage.race_update_success, res, []);
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
	 * Delete race by id.
	 *
	 * @param Object req
	 * @return Object res
	 */
	destroy = (req, res) => {
    Race.findOne({
	    where: {
	    	id: req.params.id
	    }
	  })
    .then(race => {
    	if (race) {
	      Race.destroy({ where: { id: req.params.id } })
	      .then(race => {

	      	return APIResponse.success(responseLanguage.race_delete_success, res);
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

module.exports = RaceController;