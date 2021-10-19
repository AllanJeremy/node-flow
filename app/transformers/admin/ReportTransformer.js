var fractal = require("fractal-transformer")();

const ReportTypes = require("../../helpers/ReportTypes");

class ReportTransformer {
  users = (data) =>
    fractal(data, {
      id: "id",
      user_id: "user_id",
      reported_by: "reported_by",
      reason: "reason",
      type: function (data) {
        return ReportTypes[data.get("type")];
      },
      status: function (data) {
        return data.get("status");
      },
      reported_user: {
        name: "reported_user.first_name",
        email: "reported_user.email",
      },
      reported_by_user: {
        name: "reported_by_user.first_name",
        email: "reported_by_user.email",
      },
    });
}

module.exports = ReportTransformer;
