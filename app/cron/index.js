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
			case SearchActivityAction.createUser:
				return await ElasticSearchHandler.addDocument(data.metadata.id, data.metadata);
				break;
			case SearchActivityAction.raceUpdate:
				return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
					race: data.metadata.name
				});
			case SearchActivityAction.genderUpdate:
				return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
					gender: data.metadata.name
				});
			case SearchActivityAction.familyDynamicUpdate:
				return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
					family_dynamic: data.metadata.name
				});
			case SearchActivityAction.sexualOrientationUpdate:
				return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
					sexual_orientation: data.metadata.name
				});
				break;
			case SearchActivityAction.healthCategoryUpdate:
				return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
					health_categories: data.metadata.name
				});
				break;
			case SearchActivityAction.workoutUpdate:
				return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
					workouts: data.metadata.name
				});
				break;
      case SearchActivityAction.listedPeerUpdate:
        return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
          listed_peers: data.metadata.listed_peers
        });
        break;
      case SearchActivityAction.delistedPeerUpdate:
        return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
          delisted_peers: data.metadata.delisted_peers
        });
        break;
      case SearchActivityAction.raceRenamed:
        return await ElasticSearchHandler.renameDocumentField('race', data.metadata);
      case SearchActivityAction.genderRenamed:
        return await ElasticSearchHandler.renameDocumentField('gender', data.metadata);
      case SearchActivityAction.familyDynamicRenamed:
        return await ElasticSearchHandler.renameDocumentField('family_dynamic', data.metadata);
      case SearchActivityAction.sexualOrientationRenamed:
        return await ElasticSearchHandler.renameDocumentField('sexual_orientation', data.metadata);
        break;
      case SearchActivityAction.healthCategoryRenamed:
        return await ElasticSearchHandler.renameDocumentListItem('health_categories', data.metadata);
        break;
      case SearchActivityAction.workoutRenamed:
        return await ElasticSearchHandler.renameDocumentListItem('workouts', data.metadata);
        break;
      case SearchActivityAction.raceDelete:
        return await ElasticSearchHandler.deleteDocumentField('race', data.metadata.name);
      case SearchActivityAction.genderDelete:
        return await ElasticSearchHandler.deleteDocumentField('gender', data.metadata.name);
      case SearchActivityAction.familyDynamicDelete:
        return await ElasticSearchHandler.deleteDocumentField('family_dynamic', data.metadata.name);
      case SearchActivityAction.sexualOrientationDelete:
        return await ElasticSearchHandler.deleteDocumentField('sexual_orientation', data.metadata.name);
      case SearchActivityAction.healthCategoryDelete:
        return await ElasticSearchHandler.deleteItemFromDocumentList('health_categories', data.metadata.name);
      case SearchActivityAction.workoutDelete:
        return await ElasticSearchHandler.deleteItemFromDocumentList('workouts', data.metadata.name);
      case SearchActivityAction.userVisibility:
        return await ElasticSearchHandler.addDocument(data.metadata.id, data.metadata);
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
		    			if(res.statusCode == 200 || res.statusCode == 201) {
		    				SearchActivityHandler.destroy(item.id);
		    			} else {
		    				SearchActivityHandler.update(item.id, res, item.attempted);
		    			}
		    		}).catch(err => {
              if(err.body) {
		    			  SearchActivityHandler.update(item.id, err.body.error, item.attempted);
              }
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
