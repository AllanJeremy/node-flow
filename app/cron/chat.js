const cron = require("node-cron");
const https = require("https");

var { StreamChat } = require('stream-chat');

/**
 * Models
 */
const Models = require('../models');
const Channel = Models.Channel;
const ExportChannel = Models.ExportChannel;
const DeleteChannelMessage = Models.DeleteChannelMessage;

const serverClient = StreamChat.getInstance(process.env.GET_STREAM_API_KEY, process.env.GET_STREAM_API_SECRET, { timeout: 6000 });

/**
 * Manages cron job task for message retention
 *
 * @class MessageRetention
 * @package app
 * @subpackage helpers
 */
class MessageRetention {

  DeleteMessages = async () => {

    DeleteChannelMessage.findAll({
      where: {
        status: 0
      }
    }).then(response => {
      response.map(async (item) => {
        DeleteChannelMessage.update({
          status: 1
        }, {
          where: {
            id: item['id']
          }
        });
        try {
          const isDeleted = await serverClient.deleteMessage(item['message_id'], true);
          if(isDeleted) {
            DeleteChannelMessage.destroy({
              where: {
                message_id: item['message_id']
              }
            });
          }
        }
        catch (err) {
          // error
        }
      });
    }).catch(err => {
      // error
    });
  }

  ExportChannel = async () => {
    Channel.findAll().then(response => {
      response.map(async (item) => {
        var date = new Date();
        date.setDate(date.getDate() - item['message_retention']);
        const response = await serverClient.exportChannel({
          type: "messaging",
          id: item['channel_id'],
          messages_until: date
        });
        const taskID = response.task_id;
        ExportChannel.findOne({
          where: {
            channel_id: item['id']
          }
        }).then(response => {
          if (!response) {
            ExportChannel.create({
              channel_id: item['id'],
              task_id: taskID
            });
          }
        }).catch(err => {
          // error
        });
      });
    });
  }

  GetMessages = async () => {
    ExportChannel.findAll().then(response => {
      response.map(async (item) => {
        const taskID = item.task_id;
        const channelResponse = await serverClient.getExportChannelStatus(item.task_id);
        https.get(channelResponse.result.url, function (res) {
          let data = '',
            json_data = '';

          res.on('data', function (channel) {
            data += channel;
          });
          res.on('end', function () {
            json_data = JSON.parse(data);
            if(json_data.length > 0) {
              json_data[0].messages.map((item) => {
                DeleteChannelMessage.findOne({
                  where: {
                    message_id: item.id
                  }
                }).then(response => {
                  if(!response) {
                    DeleteChannelMessage.create({
                      message_id: item.id,
                      status: 0
                    });
                  }
                });
              });
              ExportChannel.destroy({
                where: {
                  task_id: item['task_id']
                }
              });
            }
          });
        }).on('error', function (e) {
          // error
        });

      });
    });
  }
}

module.exports = MessageRetention;
