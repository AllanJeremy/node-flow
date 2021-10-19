const cryptoRandomString = require("crypto-random-string");

exports.string = function (length) {
  return cryptoRandomString({
    length: length,
    type: "numeric",
  });
};
