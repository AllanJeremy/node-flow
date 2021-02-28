/**
 * Manages api response across the system
 *
 * @class ResponseHandler
 * @package app
 * @subpackage helpers
 */
class ResponseHandler {

  /**
   * Used for returning success response
   *
   * @param {Object} res
   * @param {String} message
   * @param {Array} data
   */
  success = (res, message, data = []) => {
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
   * @param {Object} res
   * @param {Integer} code
   * @param {String} message
   * @param {Array} data
   */
  error = (res, code, message, data = []) => {
    return res
      .status(code)
      .send({
        output: data,
        message: message
      })
  }

}

module.exports = ResponseHandler;
