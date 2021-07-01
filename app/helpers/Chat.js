var {StreamChat} = require('stream-chat');

/**
 * Used for mobile app chat functionality
 *
 * @class Chat
 * @package app
 * @subpackage helpers
 */
class Chat {

  /**
   * Used for generating user chat token
   *
   * @param {Integer} user_id
   */
  token = (user_id) => {
    // Initialize a Server Client
    const serverClient = StreamChat.getInstance( process.env.GET_STREAM_API_KEY, process.env.GET_STREAM_API_SECRET);

    // Create User Token
    const token = serverClient.createToken(user_id);

    return token;
  }
}

module.exports = Chat;
