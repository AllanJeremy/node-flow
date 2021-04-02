/**
 * Configs
 */
const config = require('../config/elasticsearch.config.js');

/**
 * Elastic search library
 */
const { Client } = require('@elastic/elasticsearch');


/**
 * Elastic search config
 */
const client = new Client({
  node: config.node,
  auth: {
    username: config.username,
    password: config.password
  }
});

const indexName = "users";

/**
 * Manages Elastic search operation
 *
 * @class elasticSearchHandler
 * @package app
 * @subpackage helpers
 */
class ElasticSearchHandler {

	/**
	* Create the index
	*/
	initIndex = () => {
    return client.indices.create({
      index: indexName
    });
	}


	/**
	* Check if the index exists
	*/
	indexExists = () => {
    return client.indices.exists({
      index: indexName
    });
	}

	/**
	* Add data in the index
	*/
	addDocument = async(id, body) => {
    let res = await client.index({
     	index: indexName,
     	id: id,
	    body: body
    });
    return res;
  }

  /**
	* Update data by id in the index
	*/
  updateDocument = async(id, body) => {
    let res = await client.update({
     	index: indexName,
     	id: id,
	    body: { doc: body}
    });

    return res;
  }

  /**
  * Delete document field by search query
  */
  deleteDocumentField = async(deleteField, matchQuery) => {
    let res = await client.updateByQuery({
      index: indexName,
      body: {
        script: {
          'source': 'ctx._source.remove("' + deleteField + '")',
          'lang': 'painless'
        },
        query: {
          term: eval({[deleteField] : matchQuery.toLowerCase()})
        }
      }
    });
    return res;
  }

  /**
  * Delete item from array in document field by name
  */
  deleteItemFromDocumentList = async(deleteField, matchParam) => {
    let scriptQuery = ''
    if(deleteField == 'health_categories') {
      scriptQuery = "if(ctx._source.containsKey('health_categories') && ctx._source.health_categories.size() > 0){for(int i=0;i<ctx._source.health_categories.size();i++){if(ctx._source.health_categories[i]==params.name){ctx._source.health_categories.remove(i)}}}";
    } else if(deleteField == 'workouts') {
      scriptQuery = "if(ctx._source.containsKey('workouts') && ctx._source.workouts.size() > 0){for(int i=0;i<ctx._source.workouts.size();i++){if(ctx._source.workouts[i]==params.name){ctx._source.workouts.remove(i)}}}";
    }

    if(scriptQuery) {
      let res = await client.updateByQuery({
        index: indexName,
        body: {
          script: {
            'inline':scriptQuery,
            'lang': 'painless',
            'params': {
              'name': matchParam
            }
          }
        }
      });

      return res;
    }
  }

}

module.exports = ElasticSearchHandler;
