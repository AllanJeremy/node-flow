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
class elasticSearchHandler {

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
     	index: 'users',
     	id: id,
	    body: body
    });
    return res;
  }

  /**
	* Update data by id in the index
	*/
  updateDocument = (id, body) => {
    let res = client.update({
     	index: 'users',
     	id: id,
	    body: { doc: body}
    });
    return res;
  }

}

module.exports = elasticSearchHandler;