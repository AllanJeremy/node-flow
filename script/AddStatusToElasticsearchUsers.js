var AddStatusToElasticsearchUsers = require("../app/scripts/AddStatusToElasticsearchUsers.js");
AddStatusToElasticsearchUsers = new AddStatusToElasticsearchUsers();

AddStatusToElasticsearchUsers.index(process.argv.slice(2)[0]);
