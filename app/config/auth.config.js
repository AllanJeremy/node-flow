require("dotenv").config();

module.exports = {
  secret: process.env.APP_SECRET, // this key will be used in generating JWT token
  tokenExpiryTime: 31536000, // token expiry time in seconds
  expiryTime: 8760, // token expiry time in hours
  linkedinTokenExpiryTime: 45, // linkedin token expiry time in days
};
