const { validationResult } = require('express-validator');

var APIResponse = require('../../../../helpers/APIResponse');
APIResponse = new APIResponse();

const language = require('../../../../language/en_default');
const responseLanguage = language.en.admin.response;

var CommonTransformer = require('../../../../transformers/core/CommonTransformer');
CommonTransformer = new CommonTransformer();

const db = require('../../../../models');
const HealthCategory = db.health_category;

class HealthCategoryController {

	/**
	 * Show health category list.
	 *
	 * @param Object req
	 * @return Object res
	 */
	list = (req, res) => {
		HealthCategory.findAll()
    .then(response => {

      return APIResponse.success("", res, CommonTransformer.transform(response));
    })
    .catch(err => {

      return APIResponse.error(500, err.message, res);
    });
	}


	/**
	 * Store a newly created health category in storage.
	 *
	 * @param Object req
	 * @return Object res
	 */
	store = (req, res) => {
		const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return APIResponse.error(422, errors.array(), res);
    }

    HealthCategory.findOne({
	    where: {
	      name: req.body.name
	    }
	  }).then(response => {
  		if(!response) {
		    HealthCategory.create({
			    name: req.body.name,
			    status: req.body.status
			  })
		    .then(response => {

		      return APIResponse.success(responseLanguage.health_category_store_success, res, []);
		    })
		    .catch(err => {

		      return APIResponse.error(500, err.message, res);
		    })
		  } else {

		  	return APIResponse.error(400, responseLanguage.health_category_exist, res);
		  }
		})
	  .catch(err => {

      return APIResponse.error(500, err.message, res);
    });
	}

	/**
	 * Update health category by id.
	 *
	 * @param Object req
	 * @return Object res
	 */
	update = (req, res) => {
		const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return APIResponse.error(422, errors.array(), res);
    }

    HealthCategory.findOne({
	    where: {
	    	id: req.params.id
	    }
	  })
    .then(response => {
    	if (response) {
	      HealthCategory.update({
	        name: req.body.name,
	        status: req.body.status,
	      },
	      { where: { id: req.params.id } })
	      .then(response => {

	      	return APIResponse.success(responseLanguage.health_category_update_success, res, []);
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
	 * Delete health category by id.
	 *
	 * @param Object req
	 * @return Object res
	 */
	destroy = (req, res) => {
    HealthCategory.findOne({
	    where: {
	    	id: req.params.id
	    }
	  })
    .then(response => {
    	if (response) {
	      HealthCategory.destroy({ where: { id: req.params.id } })
	      .then(response => {

	      	return APIResponse.success(responseLanguage.health_category_delete_success, res);
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

module.exports = HealthCategoryController;
