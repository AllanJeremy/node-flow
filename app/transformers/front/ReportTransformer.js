var fractal = require("fractal-transformer")();

class ReportTransformer {
  static reason = (data) =>
    fractal(data, {
      key: "key",
      reason: "reason",
    });
}

module.exports = ReportTransformer;
