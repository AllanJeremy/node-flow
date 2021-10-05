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
	* Add or update document in the index
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
  * Update document field by id in the index
  */
  updateDocumentField = async(id, body) => {
    let res = await client.update({
      index: indexName,
      id: id,
      body: { doc: body}
    });

    return res;
  }

  /**
  * Rename item from field in document by matching name
  */
  renameDocumentField = async(renameField, matchParam) => {
    let scriptQuery = ''
    if (renameField == 'race') {
      scriptQuery = 'ctx._source.race = params.name';
    }

    let res = await client.updateByQuery({
      index: indexName,
      body: {
        script: {
          'inline': scriptQuery,
          'lang': 'painless',
          'params': {
            'name': matchParam.name
          }
        },
        query: {
          match: eval({[renameField] : matchParam.old_name.toLowerCase()})
        }
      }
    });

    return res;
  }

  /**
  * Rename item from array in document field by matching name
  */
  renameDocumentListItem = async(updateField, matchParam) => {
    let scriptQuery = ''
    if (updateField == 'health_categories') {
      scriptQuery = "if (ctx._source.containsKey('health_categories') && ctx._source.health_categories.size() > 0){for(int i=0;i<ctx._source.health_categories.size();i++){if(ctx._source.health_categories[i]==params.searchName){ctx._source.health_categories[i] = params.name}}}";
    } else if (updateField == 'workouts') {
      scriptQuery = "if (ctx._source.containsKey('workouts') && ctx._source.workouts.size() > 0){for(int i=0;i<ctx._source.workouts.size();i++){if(ctx._source.workouts[i]==params.searchName){ctx._source.workouts[i] = params.name}}}";
    }

    if (scriptQuery) {
      let res = await client.updateByQuery({
        index: indexName,
        body: {
          script: {
            'inline':scriptQuery,
            'lang': 'painless',
            'params': {
              'name': matchParam.name,
              'searchName': matchParam.old_name
            }
          }
        }
      });

      return res;
    }
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
          match: eval({[deleteField] : matchQuery.toLowerCase()})
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
    if (deleteField == 'health_categories') {
      scriptQuery = "if(ctx._source.containsKey('health_categories') && ctx._source.health_categories.size() > 0){for(int i=0;i<ctx._source.health_categories.size();i++){if(ctx._source.health_categories[i]==params.name){ctx._source.health_categories.remove(i)}}}";
    } else if (deleteField == 'workouts') {
      scriptQuery = "if(ctx._source.containsKey('workouts') && ctx._source.workouts.size() > 0){for(int i=0;i<ctx._source.workouts.size();i++){if(ctx._source.workouts[i]==params.name){ctx._source.workouts.remove(i)}}}";
    }

    if (scriptQuery) {
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

  getAllUser = async() => {
    let res = await client.search({
      index: indexName,
      filter_path : "hits.hits._source"
    });

    console.log("resres00001111", res);

    if(res.body && res.body.hits) {
      return res.body.hits.hits;
    } else {
      return '';
    }
  }


  getLoginUser = async(userId) => {
    let res = await client.search({
      index: indexName,
      filter_path : "hits.hits._source",
      body: { query: {
        match: {"id": 2}
      }}
    });

    if(res.body && res.body.hits) {
      return res.body.hits.hits;
    } else {
      return '';
    }
  }

}

module.exports = ElasticSearchHandler;
