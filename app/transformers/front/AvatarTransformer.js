var fractal = require("fractal-transformer")();
require("dotenv").config();

class CommonTransformer {
  transform = (data) =>
    fractal(data, {
      id: "id",
      avatar: function (data) {
        return process.env.API_IMAGE_URL + "/avatar/" + data.get("name");
      },
      status: function (data) {
        return data.get("status");
      },
    });
}

module.exports = CommonTransformer;
