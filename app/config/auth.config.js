require('dotenv').config();

module.exports = {
  secret: process.env.APP_SECRET, // this key will be used in generating JWT token
  tokenExpiryTime: 20 // 24 hours
};
