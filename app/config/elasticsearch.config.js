require("dotenv").config();

module.exports = {
  node: process.env.ELASTIC_SEARCH_ACCESS_URL,
  username: process.env.ELASTIC_SEARCH_USERNAME,
  password: process.env.ELASTIC_SEARCH_PASSWORD,
};
