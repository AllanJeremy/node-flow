/* 
    This file is simply meant to be an aggregator of all admin transformer related functions *listed alphabetically.*
    This file does not implement any logic of its own and simply serves the purpose of importing functions and exporting them out together so that they can be loaded from one file.
*/
const AvatarTransformer = require("./AvatarTransformer");
const ConversationStarterTransformer = require("./ConversationStarterTransformer");
const ReportTransformer = require("./ReportTransformer");
const UserTransformer = require("./UserTransformer");

//* EXPORTS
module.exports = {
  AvatarTransformer,
  ConversationStarterTransformer,
  ReportTransformer,
  UserTransformer,
};
