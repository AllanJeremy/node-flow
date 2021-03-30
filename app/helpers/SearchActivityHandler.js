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
   * Used for deleting data
   *
   * @param {Integer} id
   */
  destroy = (id) => {
    SearchActivity.destroy({ where: { id: id } });
  }
}

module.exports = SearchActivityHandler;
