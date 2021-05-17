const cron = require("node-cron");

/**
 * Helpers
 */
const ElasticsearchEventsAction = require('../helpers/ElasticsearchEventsAction');

/**
 * Elastic search handler
 */
let ElasticSearchHandler = require('../helpers/ElasticSearchHandler');
ElasticSearchHandler = new ElasticSearchHandler();

var ElasticsearchEventsHandler = require('../helpers/ElasticsearchEventsHandler');
ElasticsearchEventsHandler = new ElasticsearchEventsHandler();


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
    switch(data.action) {
      case ElasticsearchEventsAction.createUser:
        return await ElasticSearchHandler.addDocument(data.metadata.id, data.metadata);
        break;
      case ElasticsearchEventsAction.raceUpdate:
        return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
          race: data.metadata.name
        });
      case ElasticsearchEventsAction.genderUpdate:
        return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
          gender: data.metadata.name
        });
      case ElasticsearchEventsAction.familyDynamicUpdate:
        return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
          family_dynamic: data.metadata.name
        });
      case ElasticsearchEventsAction.sexualOrientationUpdate:
        return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
          sexual_orientation: data.metadata.name
        });
        break;
      case ElasticsearchEventsAction.healthCategoryUpdate:
        return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
          health_categories: data.metadata.name
        });
        break;
      case ElasticsearchEventsAction.workoutUpdate:
        return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
          workouts: data.metadata.name
        });
        break;
      case ElasticsearchEventsAction.listedPeerUpdate:
        return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
          listed_peers: data.metadata.listed_peers
        });
        break;
      case ElasticsearchEventsAction.delistedPeerUpdate:
        return await ElasticSearchHandler.updateDocumentField(data.metadata.id, {
          delisted_peers: data.metadata.delisted_peers
        });
        break;
      case ElasticsearchEventsAction.raceRenamed:
        return await ElasticSearchHandler.renameDocumentField('race', data.metadata);
      case ElasticsearchEventsAction.genderRenamed:
        return await ElasticSearchHandler.renameDocumentField('gender', data.metadata);
      case ElasticsearchEventsAction.familyDynamicRenamed:
        return await ElasticSearchHandler.renameDocumentField('family_dynamic', data.metadata);
      case ElasticsearchEventsAction.sexualOrientationRenamed:
        return await ElasticSearchHandler.renameDocumentField('sexual_orientation', data.metadata);
        break;
      case ElasticsearchEventsAction.healthCategoryRenamed:
        return await ElasticSearchHandler.renameDocumentListItem('health_categories', data.metadata);
        break;
      case ElasticsearchEventsAction.workoutRenamed:
        return await ElasticSearchHandler.renameDocumentListItem('workouts', data.metadata);
        break;
      case ElasticsearchEventsAction.raceDelete:
        return await ElasticSearchHandler.deleteDocumentField('race', data.metadata.name);
      case ElasticsearchEventsAction.genderDelete:
        return await ElasticSearchHandler.deleteDocumentField('gender', data.metadata.name);
      case ElasticsearchEventsAction.familyDynamicDelete:
        return await ElasticSearchHandler.deleteDocumentField('family_dynamic', data.metadata.name);
      case ElasticsearchEventsAction.sexualOrientationDelete:
        return await ElasticSearchHandler.deleteDocumentField('sexual_orientation', data.metadata.name);
      case ElasticsearchEventsAction.healthCategoryDelete:
        return await ElasticSearchHandler.deleteItemFromDocumentList('health_categories', data.metadata.name);
      case ElasticsearchEventsAction.workoutDelete:
        return await ElasticSearchHandler.deleteItemFromDocumentList('workouts', data.metadata.name);
      case ElasticsearchEventsAction.userVisibility:
        return await ElasticSearchHandler.addDocument(data.metadata.id, data.metadata);
    }
  }

  /**
  * Cron job entry point
  */
  start = async() => {
    if (ElasticSearchHandler.indexExists()) {
      ElasticsearchEventsHandler.list()
      .then(response => {
        response.map(async(item, index) => {
          if (item.attempted < 3) {
            this.elasticSearch(item.dataValues).then(res => {
              if(res.statusCode == 200 || res.statusCode == 201) {
                ElasticsearchEventsHandler.destroy(item.id);
              } else {
                ElasticsearchEventsHandler.update(item.id, res, item.attempted);
              }
            }).catch(err => {
              if (err.body) {
                ElasticsearchEventsHandler.update(item.id, err.body.error, item.attempted);
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
