require('dotenv').config();

module.exports = {
  secret: process.env.APP_SECRET, // this key will be used in generating JWT token
  tokenExpiryTime: 86400, // token expiry time in seconds
  expiryTime: 24 // token expiry time in hours
};
