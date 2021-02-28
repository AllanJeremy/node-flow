/**
 * Manages APIResponse across the system
 *
 * @class APIResponse
 * @package app
 * @subpackage helpers
 */
class APIResponse {

  /**
   * Used for returning success response
   *
   * @param {String} message
   * @param {Object} res
   * @param {Array} data
   */
  success = (message, res, data = []) => {
    return res
      .status(200)
      .send({
        output: data,
        message: message
      })
  }

  /**
   * Used for returning error response
   *
   * @param {Integer} status
   * @param {String} message
   * @param {Object} res
   * @param {Array} data
   */
  error = (status, message, res, data = []) => {
    return res
      .status(status)
      .send({
        output: data,
        message: message
      })
  }

}

module.exports = APIResponse;
