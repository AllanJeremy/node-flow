/* 
    This file is simply meant to be an aggregator of all front controller related functions *listed alphabetically.*
    This file does not implement any logic of its own and simply serves the purpose of importing functions and exporting them out together so that they can be loaded from one file.
*/
const AuthController = require("./AuthController");
const ChatController = require("./ChatController");
const CommonController = require("./CommonController");
const ConfigurationController = require("./ConfigurationController");
const ConversationStarterController = require("./ConversationStarterController");
const ErrorLogController = require("./ErrorLogController");
const FamilyDynamicController = require("./FamilyDynamicController");
const GenderController = require("./GenderController");
const HealthCategoryController = require("./HealthCategoryController");
const LanguageController = require("./LanguageController");
const PeerController = require("./PeerController");
const PersonalityQuestionController = require("./PersonalityQuestionController");
const RaceController = require("./RaceController");
const ReportController = require("./ReportController");
const SexualOrientationController = require("./SexualOrientationController");
const UserProfileController = require("./UserProfileController");
const WorkoutController = require("./WorkoutController");

//* EXPORTS
module.exports = {
  AuthController,
  ChatController,
  CommonController,
  ConfigurationController,
  ConversationStarterController,
  ErrorLogController,
  FamilyDynamicController,
  GenderController,
  HealthCategoryController,
  LanguageController,
  PeerController,
  PersonalityQuestionController,
  RaceController,
  ReportController,
  SexualOrientationController,
  UserProfileController,
  WorkoutController,
};
