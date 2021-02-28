const { validationResult } = require('express-validator');

var APIResponse = require('../../../../helpers/APIResponse');
APIResponse = new APIResponse();

const language = require('../../../../language/en_default');
const responseLanguage = language.en.admin.response;

var CommonTransformer = require('../../../../transformers/core/CommonTransformer');
CommonTransformer = new CommonTransformer();

const db = require('../../../../models');
const Gender = db.gender;

class GenderController {

	/**
	 * Show gender list.
	 *
	 * @param Object req
	 * @return Object res
	 */
	list = (req, res) => {
		Gender.findAll()
    .then(response => {

      return APIResponse.success("", res, CommonTransformer.transform(response));
    })
    .catch(err => {

      return APIResponse.error(500, err.message, res);
    });
	}


	/**
	 * Store a newly created gender in storage.
	 *
	 * @param Object req
	 * @return Object res
	 */
	store = (req, res) => {
		const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return APIResponse.error(422, errors.array(), res);
    }

    Gender.findOne({
	    where: {
	      name: req.body.name
	    }
	  }).then(response => {
  		if(!response) {
		    Gender.create({
			    name: req.body.name,
			    status: req.body.status
			  })
		    .then(response => {

		      return APIResponse.success(responseLanguage.gender_store_success, res, []);
		    })
		    .catch(err => {

		      return APIResponse.error(500, err.message, res);
		    })
		  } else {

		  	return APIResponse.error(400, responseLanguage.gender_exist, res);
		  }
		})
	  .catch(err => {

      return APIResponse.error(500, err.message, res);
    });
	}

	/**
	 * Update gender by id.
	 *
	 * @param Object req
	 * @return Object res
	 */
	update = (req, res) => {
		const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return APIResponse.error(422, errors.array(), res);
    }

    Gender.findOne({
	    where: {
	    	id: req.params.id
	    }
	  })
    .then(response => {
    	if (response) {
	      Gender.update({
	        name: req.body.name,
	        status: req.body.status,
	      },
	      { where: { id: req.params.id } })
	      .then(response => {

	      	return APIResponse.success(responseLanguage.gender_update_success, res, []);
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
	 * Delete gender by id.
	 *
	 * @param Object req
	 * @return Object res
	 */
	destroy = (req, res) => {
    Gender.findOne({
	    where: {
	    	id: req.params.id
	    }
	  })
    .then(response => {
    	if (response) {
	      Gender.destroy({ where: { id: req.params.id } })
	      .then(response => {

	      	return APIResponse.success(responseLanguage.gender_delete_success, res);
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

module.exports = GenderController;
