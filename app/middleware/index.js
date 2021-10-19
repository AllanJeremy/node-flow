const VerifyApiToken = require("./VerifyApiToken");
const HasPermission = require("./HasPermission");

module.exports = {
  VerifyApiToken: VerifyApiToken.verify,
  HasPermission: HasPermission.verify,
};
