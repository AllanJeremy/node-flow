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
  * Delete document field by id in the index
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

}

module.exports = ElasticSearchHandler;
