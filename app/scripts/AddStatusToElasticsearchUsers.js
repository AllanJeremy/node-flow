var ElasticSearchHandler = require("../helpers/ElasticSearchHandler");
ElasticSearchHandler = new ElasticSearchHandler();

const StatusHandler = require("../helpers/StatusHandler");

/**
 * Models
 */
const Models = require("../models");
const User = Models.User;

/**
 * Add status to Elastic search users
 *
 * @class StatusToElasticsearchUsers
 * @package app
 * @subpackage scripts
 */
class AddStatusToElasticsearchUsers {
  index = (status) => {
    var elasticSearchStatus =
      status == "published"
        ? {
            published: StatusHandler.active,
          }
        : {
            status: StatusHandler.active,
          };
    User.findAll({
      where: elasticSearchStatus,
    })
      .then(async (users) => {
        for (let i = 0; i < users.length; i++) {
          var user = users[i];
          await this.sync(user, elasticSearchStatus);
        }
      })
      .catch((err) => {
        //error
      });
  };

  sync = async (user, status) => {
    await ElasticSearchHandler.updateDocumentField(user.id, status);
  };
}

module.exports = AddStatusToElasticsearchUsers;
