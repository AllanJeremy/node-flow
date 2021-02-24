const VerifyApiToken = require('./VerifyApiToken');
const CheckPermission = require('./CheckPermission');

module.exports = {
  VerifyApiToken: VerifyApiToken.verify,
  CheckPermission: CheckPermission.check
};