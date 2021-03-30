const cron = require("node-cron");
const { DateTime } = require('luxon');

/**
 * Helpers
 */
const SearchActivityAction = require('../helpers/SearchActivityAction');

/**
 * Elastic search handler
 */
let elasticSearchHandler = require('../helpers/elasticSearchHandler');
elasticSearchHandler = new elasticSearchHandler();

/**
 * Models
 */
const Models = require('../models');
const SearchActivity = Models.SearchActivity;


/**
 * Manages cron job task
 *
 * @class elasticSearchHandler
 * @package app
 * @subpackage helpers
 */
class cronJob {

	/**
	* Create or update document in elastic search for given user id
	*
	* Param [Object] user detail
	* Response [Object] return elastic search object
	*/
	elasticSearch = async(data) => {
		switch(data.action){
			case SearchActivityAction.basicProfile:
				return await elasticSearchHandler.addDocument(data.metadata.id, data.metadata);
				break;
			case SearchActivityAction.race:
				return await elasticSearchHandler.updateDocument(data.metadata.id, {
					race: data.metadata.name
				});
			case SearchActivityAction.gender:
				return await elasticSearchHandler.updateDocument(data.metadata.id, {
					gender: data.metadata.name
				});
			case SearchActivityAction.familyDynamic:
				return await elasticSearchHandler.updateDocument(data.metadata.id, {
					family_dynamic: data.metadata.name
				});
			case SearchActivityAction.sexualOrientation:
				return await elasticSearchHandler.updateDocument(data.metadata.id, {
					sexual_orientation: data.metadata.name
				});
				break;
			case SearchActivityAction.healthCategory:
				return await elasticSearchHandler.updateDocument(data.metadata.id, {
					health_category: data.metadata.name
				});
				break;
			case SearchActivityAction.workout:
				return await elasticSearchHandler.updateDocument(data.metadata.id, {
					workout: data.metadata.name
				});
				break;
			case SearchActivityAction.listedPeerUpdate:
				return await elasticSearchHandler.updateDocument(data.metadata.id, {
					listed_peers: data.metadata.listed_peers
				});
				break;
			case SearchActivityAction.delistedPeerUpdate:
				return await elasticSearchHandler.updateDocument(data.metadata.id, {
					delisted_peers: data.metadata.delisted_peers
				});
				break;
		}
	}

	/**
	* Handle elastic search error
	*/
	elasticSearchFailed = (id, reason, attempted = 0) => {
		SearchActivity.update({
			attempted_at: DateTime.now(),
			failed_reason: reason,
			attempted: attempted + 1
		}, {
			where: { id: id }
		});
	}

	/**
	* Cron job entry point
	*/
	start = async() => {

		if(elasticSearchHandler.indexExists()) {

			SearchActivity.findAll()
	    .then(response => {
	    	response.map(async(item, index) => {
	    		if(item.attempted < 3) {
		    		this.elasticSearch(item.dataValues).then(res => {
		    			if(res.statusCode == 200) {
		    				SearchActivity.destroy({ where: { id: item.id } });
		    			} else {
		    				this.elasticSearchFailed(item.id, res.body, item.attempted);
		    			}
		    		}).catch(err => {
		    			this.elasticSearchFailed(item.id, err.body, item.attempted);
		    		});
		    	}
	    	});
	    })
	    .catch(err => {
	      // error
	    });
	  } else {
	  	elasticSearchHandler.initIndex();
	  }



		// cron.schedule("* * * * *", function() {
		//   console.log("running a task every minute");
		// });
	}

}

module.exports = cronJob;