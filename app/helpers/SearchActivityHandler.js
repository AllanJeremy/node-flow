const { DateTime } = require('luxon');

/**
 * Models
 */
const Models = require('../models');
const SearchActivity = Models.SearchActivity;


/**
 * Manages search activity model operations
 *
 * @class SearchActivityHandler
 * @package app
 * @subpackage helpers
 */
class SearchActivityHandler {

  /**
   * Used for getting data
   *
   */
  list = async() => {
    let response = await SearchActivity.findAll({
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
    SearchActivity.create({
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
    SearchActivity.update({
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
    SearchActivity.destroy({ where: { id: id } });
  }
}

module.exports = SearchActivityHandler;
