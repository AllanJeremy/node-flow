var { StreamChat } = require('stream-chat');

/**
 * Used for mobile app chat functionality
 *
 * @class Chat
 * @package app
 * @subpackage helpers
 */
class Chat {

  /**
   * Generate stream instance
   *
   */
  getInstance = () => {
    // Initialize a Server Client
    let client = StreamChat.getInstance(process.env.GET_STREAM_API_KEY, process.env.GET_STREAM_API_SECRET);

    return client;
  }

  /**
   * Used for generating user chat token
   *
   * @param {Integer} user_id
   */
  token = (user_id) => {
    let client = this.getInstance();
    let token = client.createToken(user_id);

    return token;
  }

  createUser = async (data) => {
    let client = this.getInstance();
    let response = await client.upsertUser(data);

    return response;
  }

  updateUser = async(data) => {
    let client = this.getInstance();
    let response = await client.upsertUser({
      id: data.id,
      first_name: data.first_name,
      name: data.name,
      image: data.image
    });

    return response;
  }
}

module.exports = Chat;
