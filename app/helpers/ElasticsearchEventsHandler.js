const { DateTime } = require('luxon');

/**
 * Models
 */
const Models = require('../models');
const ElasticsearchEvents = Models.ElasticsearchEvents;


/**
 * Manages search activity model operations
 *
 * @class ElasticsearchEventsHandler
 * @package app
 * @subpackage helpers
 */
class ElasticsearchEventsHandler {

  /**
   * Used for getting data
   *
   */
  list = async() => {
    let response = await ElasticsearchEvents.findAll({
      order: [['id', 'ASC']]
    });
    return response;
  }

  /**
   * Used for storing data
   *
   * @param {String} action
   * @param {Object} data
   */
  store = (action, data) => {
    ElasticsearchEvents.create({
      action: action,
      metadata: data
    });
  }

  /**
   * Used for updating data
   *
   * @param {Integer} id
   * @param {Object} reason
   * @param {Integer} attempted
   */
  update = (id, reason, attempted = 0) => {
    ElasticsearchEvents.update({
      attempted_at: DateTime.now(),
      failed_reason: reason,
      attempted: attempted + 1
    }, {
      where: { id: id }
    });
  }


  /**
   * Used for deleting data
   *
   * @param {Integer} id
   */
  destroy = (id) => {
    ElasticsearchEvents.destroy({ where: { id: id } });
  }
}

module.exports = ElasticsearchEventsHandler;
