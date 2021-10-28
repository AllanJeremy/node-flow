var fractal = require("fractal-transformer")();
require("dotenv").config();

class ChatTransformer {
  static transform = (data) =>
    fractal(data, {
      id: "id",
      channel_id: "channel_id",
      message_retention: "message_retention",
    });
}

module.exports = ChatTransformer;
