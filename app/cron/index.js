const cron = require("node-cron");

/**
 * Helpers
 */
const SearchActivityAction = require('../helpers/SearchActivityAction');

/**
 * Elastic search handler
 */
let ElasticSearchHandler = require('../helpers/ElasticSearchHandler');
ElasticSearchHandler = new ElasticSearchHandler();

var SearchActivityHandler = require('../helpers/SearchActivityHandler');
SearchActivityHandler = new SearchActivityHandler();


/**
 * Manages cron job task
 *
 * @class ElasticSearchHandler
 * @package app
 * @subpackage helpers
 */
class job {

	/**
	* Create or update document in elastic search for given user id
	*
	* Param [Object] user detail
	* Response [Object] return elastic search object
	*/
	elasticSearch = async(data) => {
		switch(data.action){
			case SearchActivityAction.basicProfile:
				return await ElasticSearchHandler.addDocument(data.metadata.id, data.metadata);
				break;
			case SearchActivityAction.raceUpdate:
				return await ElasticSearchHandler.updateDocument(data.metadata.id, {
					race: data.metadata.name
				});
			case SearchActivityAction.genderUpdate:
				return await ElasticSearchHandler.updateDocument(data.metadata.id, {
					gender: data.metadata.name
				});
			case SearchActivityAction.familyDynamicUpadte:
				return await ElasticSearchHandler.updateDocument(data.metadata.id, {
					family_dynamic: data.metadata.name
				});
			case SearchActivityAction.sexualOrientationUpdate:
				return await ElasticSearchHandler.updateDocument(data.metadata.id, {
					sexual_orientation: data.metadata.name
				});
				break;
			case SearchActivityAction.healthCategoryUpdate:
				return await ElasticSearchHandler.updateDocument(data.metadata.id, {
					health_category: data.metadata.name
				});
				break;
			case SearchActivityAction.workoutUpdate:
				return await ElasticSearchHandler.updateDocument(data.metadata.id, {
					workout: data.metadata.name
				});
				break;
			case SearchActivityAction.listedPeerUpdate:
				return await ElasticSearchHandler.updateDocument(data.metadata.id, {
					listed_peers: data.metadata.listed_peers
				});
				break;
			case SearchActivityAction.delistedPeerUpdate:
				return await ElasticSearchHandler.updateDocument(data.metadata.id, {
					delisted_peers: data.metadata.delisted_peers
				});
				break;
      case SearchActivityAction.raceDelete:
        return await ElasticSearchHandler.deleteDocumentField('race', data.metadata.name);
		}
	}

	/**
	* Cron job entry point
	*/
	start = async() => {
		if (ElasticSearchHandler.indexExists()) {
			SearchActivityHandler.list()
	    .then(response => {
	    	response.map(async(item, index) => {
	    		if(item.attempted < 3) {
		    		this.elasticSearch(item.dataValues).then(res => {
		    			if(res.statusCode == 200) {
		    				SearchActivityHandler.destroy(item.id);
		    			} else {
		    				SearchActivityHandler.update(item.id, res.body, item.attempted);
		    			}
		    		}).catch(err => {
		    			SearchActivityHandler.update(item.id, err.body, item.attempted);
		    		});
		    	}
	    	});
	    })
	    .catch(err => {
	      // error
	    });
	  } else {
	  	ElasticSearchHandler.initIndex();
	  }

		/*cron.schedule("* * * * *", function() {
		  console.log("running a task every minute");
		});*/
	}

}

module.exports = job;
