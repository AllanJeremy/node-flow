const cron = require("node-cron");

var { StreamChat } = require('stream-chat');

/**
 * Models
 */
const Models = require('../models');
const Channel = Models.Channel;

const serverClient = StreamChat.getInstance(process.env.GET_STREAM_API_KEY, process.env.GET_STREAM_API_SECRET, { timeout: 6000 });

/**
 * Manages cron job task for message retention
 *
 * @class MessageRetention
 * @package app
 * @subpackage helpers
 */
class MessageRetention {

  start = async () => {

    var currentDate = new Date();

    Channel.findAll().then(response => {
      response.map(async (item) => {
        try {
          const filter = { type: 'messaging', cid: { $in: [item['channel_id']] } };
          const sort = [{ last_message_at: -1 }];
          const channels = await serverClient.queryChannels(filter, sort);
          channels[0].state.messages.map(async(message) => {
            await serverClient.deleteMessage(message.id, true);
          });
        }
        catch (err) {
          //
        }
      })
    }).catch(err => {
      //
    });
  }

  // ExportChannel = async() => {
  //   const response = await serverClient.exportChannel({
  //     id: "!members-iyc_0Ld_mmrXJ_Mlw9DhN5QXxMGJ_i8xFUBE3eIMgvU",
  //     messages_since: "2020-05-20T09:30:00.000Z",
  //     messages_until: "2021-06-20T11:30:00.000Z",
  //   });

  //   console.log("responseresponseresponse", response);

  //   const taskID = response.task_id;

  // }
}

module.exports = MessageRetention;
