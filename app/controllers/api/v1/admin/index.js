/* 
    This file is simply meant to be an aggregator of all admin controller related functions *listed alphabetically.*
    This file does not implement any logic of its own and simply serves the purpose of importing functions and exporting them out together so that they can be loaded from one file.
*/
const AdminPermissionController = require("./AdminPermissionController");
const AdminUserController = require("./AdminUserController");
const AuthController = require("./AuthController");
const AvatarController = require("./AvatarController");
const ConversationStarterController = require("./ConversationStarterController");
const FamilyDynamicController = require("./FamilyDynamicController");
const GenderController = require("./GenderController");
const HealthCategoryController = require("./HealthCategoryController");
const PersonalityQuestionController = require("./PersonalityQuestionController");
const RaceController = require("./RaceController");
const ReportController = require("./ReportController");
const SexualOrientationController = require("./SexualOrientationController");
const UserController = require("./UserController");
const WorkoutController = require("./WorkoutController");

//* EXPORTS
module.exports = {
  AdminPermissionController,
  AdminUserController,
  AuthController,
  AvatarController,
  ConversationStarterController,
  FamilyDynamicController,
  GenderController,
  HealthCategoryController,
  PersonalityQuestionController,
  RaceController,
  ReportController,
  SexualOrientationController,
  UserController,
  WorkoutController,
};
