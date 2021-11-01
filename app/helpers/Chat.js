var { StreamChat } = require("stream-chat");

/**
 * Languages
 */
const language = require("../language/en_default");
const chatLanguage = language.en.chat;

/**
 * Models
 */
const { Channel, ChannelUser } = require("../models");

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
  static getInstance = () => {
    // Initialize a Server Client
    let client = StreamChat.getInstance(
      process.env.GET_STREAM_API_KEY,
      process.env.GET_STREAM_API_SECRET
    );

    return client;
  };

  /**
   * Used for generating user chat token
   *
   * @param {Integer} user_id
   */
  static token = (user_id) => {
    let client = this.getInstance();
    let token = client.createToken(user_id);

    return token;
  };

  static createUser = async (data) => {
    let client = this.getInstance();
    let response = await client.upsertUser(data);

    return response;
  };

  static updateUser = async (data) => {
    let client = this.getInstance();
    let response = await client.upsertUser({
      id: data.id,
      user_id: data.user_id,
      first_name: data.first_name,
      name: data.name,
      image: data.image,
    });

    return response;
  };

  static createChannel = async (botUser, user) => {
    const client = this.getInstance();

    const channel = client.channel("messaging", {
      members: [botUser.unique_id, user.unique_id],
      created_by_id: botUser.unique_id,
      creater_id: botUser.unique_id,
      is_accepted: true,
      sender_match_feedback_completed: false,
      receiver_match_feedback_completed: false,
      is_deleted: false,
      is_deleted_by: "",
      sender_id: botUser.unique_id,
      receiver_id: user.unique_id,
    });

    await channel.create();

    Channel.create({
      channel_id: channel.id,
      message_retention: 30,
    }).then((response) => {
      ChannelUser.create({
        channel_id: response.id,
        user_id: botUser.id,
      });

      ChannelUser.create({
        channel_id: response.id,
        user_id: user.id,
      });
    });

    const message = await channel.sendMessage({
      user_id: botUser.unique_id,
      text: "Hi " + user.first_name + "! " + chatLanguage.default_message,
    });
  };
}

module.exports = Chat;
