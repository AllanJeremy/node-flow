var fractal = require("fractal-transformer")();

class ReportTransformer {
  reason = (data) =>
    fractal(data, {
      key: "key",
      reason: "reason",
    });
}

module.exports = ReportTransformer;
