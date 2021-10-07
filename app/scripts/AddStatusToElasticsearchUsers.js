var ElasticSearchHandler = require("../helpers/ElasticSearchHandler");
ElasticSearchHandler = new ElasticSearchHandler();

const StatusHandler = require('../helpers/StatusHandler');

/**
 * Models
 */
const Models = require('../models');
const User = Models.User;



/**
 * Add status to Elastic search users
 *
 * @class StatusToElasticsearchUsers
 * @package app
 * @subpackage scripts
 */
class AddStatusToElasticsearchUsers {

  index = () => {
    User.findAll({
      where: {
        published: StatusHandler.active
      }
    }).then(async users => {
      for(let i = 0; i < users.length; i++) {
        var user = users[i];
        await this.sync(user);
      }
    }).catch( err => {
      //error
    });
  }

  sync = async(user) => {
    await ElasticSearchHandler.updateDocumentField(user.id, {
      published: StatusHandler.active
    });
  }

}

module.exports = AddStatusToElasticsearchUsers;
