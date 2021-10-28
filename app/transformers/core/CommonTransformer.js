var fractal = require("fractal-transformer")();

class CommonTransformer {
  static transform = (data) =>
    fractal(data, {
      id: "id",
      name: "name",
      status: function (data) {
        return data.get("status");
      },
    });
}

module.exports = CommonTransformer;
