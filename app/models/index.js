require('dotenv').config();
var config = require('../config/db.config.js');
let env = process.env.APP_ENV;
config = config[env];

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  config.DATABASE,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.DIALECT,
    operatorsAliases: false,
    camelCase: true,
    camelCaseForFileName: true,
    logging: false,
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: true
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.AdminUser = require('../models/AdminUser.js')(sequelize, Sequelize);
db.AdminPermission = require('../models/AdminPermission.js')(sequelize, Sequelize);
db.HealthCategory = require('../models/HealthCategory.js')(sequelize, Sequelize);
db.Gender = require('../models/Gender.js')(sequelize, Sequelize);
db.SexualOrientation = require('../models/SexualOrientation.js')(sequelize, Sequelize);
db.Race = require('../models/Race.js')(sequelize, Sequelize);
db.Workout = require('../models/Workout.js')(sequelize, Sequelize);
db.FamilyDynamic = require('../models/FamilyDynamic.js')(sequelize, Sequelize);
db.User = require('../models/User.js')(sequelize, Sequelize);
db.UserMetadata = require('../models/UserMetadata.js')(sequelize, Sequelize);
db.UserWorkout = require('../models/UserWorkout.js')(sequelize, Sequelize);
db.UserHealthCategory = require('../models/UserHealthCategory.js')(sequelize, Sequelize);
db.VerifyUser = require('../models/VerifyUser.js')(sequelize, Sequelize);
db.ResetPassword = require('../models/ResetPassword.js')(sequelize, Sequelize);
db.PersonalityQuestion = require('../models/PersonalityQuestion.js')(sequelize, Sequelize);
db.UserPersonalityQuestion = require('../models/UserPersonalityQuestion.js')(sequelize, Sequelize);
db.ConversationStarter = require('../models/ConversationStarter.js')(sequelize, Sequelize);
db.UserConversationStarter = require('../models/UserConversationStarter.js')(sequelize, Sequelize);
db.UserInterest = require('../models/UserInterest.js')(sequelize, Sequelize);
db.ListedPeer = require('../models/ListedPeer.js')(sequelize, Sequelize);
db.DelistedPeer = require('../models/DelistedPeer.js')(sequelize, Sequelize);
db.ReportedUser = require('../models/ReportedUser.js')(sequelize, Sequelize);
db.ElasticsearchEvents = require('../models/ElasticsearchEvents.js')(sequelize, Sequelize);
db.Avatar = require('../models/Avatar.js')(sequelize, Sequelize);
db.UserRace = require('../models/UserRace.js')(sequelize, Sequelize);
db.UserFamilyDynamic = require('../models/UserFamilyDynamic.js')(sequelize, Sequelize);
db.UserMatchingPreference = require('../models/UserMatchingPreference.js')(sequelize, Sequelize);
db.ContactSupport = require('../models/ContactSupport.js')(sequelize, Sequelize);
db.Feedback = require('../models/Feedback.js')(sequelize, Sequelize);
db.UserSetting = require('../models/UserSetting.js')(sequelize, Sequelize);
db.DeclinedPeer = require('../models/DeclinedPeer.js')(sequelize, Sequelize);
db.MatchFeedback = require('../models/MatchFeedback.js')(sequelize, Sequelize);
db.ChatModeration = require('../models/ChatModeration.js')(sequelize, Sequelize);
db.Channel = require('../models/Channel.js')(sequelize, Sequelize);
db.ChannelUser = require('../models/ChannelUser.js')(sequelize, Sequelize);
db.ChatModeration = require('../models/ChatModeration.js')(sequelize, Sequelize);
db.DeleteChannelMessage = require('../models/DeleteChannelMessage.js')(sequelize, Sequelize);
db.ExportChannel = require('../models/ExportChannel.js')(sequelize, Sequelize);
db.UserHealthJourney = require('../models/UserHealthJourney.js')(sequelize, Sequelize);
db.ErrorLog = require('../models/ErrorLog.js')(sequelize, Sequelize);
db.Configuration = require('../models/Configuration.js')(sequelize, Sequelize);


db.User.hasOne(db.UserSetting, {foreignKey: 'user_id', as: 'user_setting'});

// relationships
db.User.hasOne(db.UserMetadata, {foreignKey: 'user_id', as: 'user_meta_data', onDelete: 'cascade', hooks: true, allowNull: false});
db.UserMetadata.belongsTo(db.Gender, {foreignKey: 'gender_id', as: 'gender', onDelete: 'cascade', hooks: true, allowNull: false});
db.UserMetadata.belongsTo(db.SexualOrientation, {foreignKey: 'sexual_orientation_id', as: 'sexual_orientation', onDelete: 'cascade', hooks: true, allowNull: false});
db.User.hasMany(db.UserHealthCategory, {foreignKey: 'user_id', as: 'health_categories', onDelete: 'cascade', hooks: true, allowNull: false});
db.UserHealthCategory.belongsTo(db.HealthCategory, {foreignKey: 'health_category_id', as: 'health_category', onDelete: 'cascade', hooks: true, allowNull: false});
db.User.hasMany(db.UserWorkout, {foreignKey: 'user_id', as: 'workouts', onDelete: 'cascade', hooks: true, allowNull: false});
db.UserWorkout.belongsTo(db.Workout, {foreignKey: 'workout_id', as: 'workout', onDelete: 'cascade', hooks: true, allowNull: false});
db.User.hasMany(db.UserPersonalityQuestion, {foreignKey: 'user_id', as: 'personality_questions'});
db.UserPersonalityQuestion.belongsTo(db.PersonalityQuestion, {foreignKey: 'question_id', as: 'personality_question', onDelete: 'cascade', hooks: true, allowNull: false});
db.User.hasMany(db.UserConversationStarter, {foreignKey: 'user_id', as: 'conversation_starters'});
db.UserConversationStarter.belongsTo(db.ConversationStarter, {foreignKey: 'conversation_starter_id', as: 'conversation_starter', onDelete: 'cascade', hooks: true, allowNull: false});
db.User.hasOne(db.UserInterest, {foreignKey: 'user_id', as: 'user_interest', onDelete: 'cascade', hooks: true, allowNull: false});
db.ListedPeer.belongsTo(db.User, {foreignKey: 'peer_id', as: 'peer', onDelete: 'cascade', hooks: true, allowNull: false});
db.DelistedPeer.belongsTo(db.User, {foreignKey: 'peer_id', as: 'peer', onDelete: 'cascade', hooks: true, allowNull: false});
db.ReportedUser.belongsTo(db.User, {foreignKey: 'user_id', as: 'reported_user'});
db.ReportedUser.belongsTo(db.User, {foreignKey: 'reported_by', as: 'reported_by_user', allowNull: false});
db.User.hasMany(db.UserRace, {foreignKey: 'user_id', as: 'races', onDelete: 'cascade', hooks: true, allowNull: false});
db.UserRace.belongsTo(db.Race, {foreignKey: 'race_id', as: 'race', onDelete: 'cascade', hooks: true, allowNull: false});
db.User.hasMany(db.UserFamilyDynamic, {foreignKey: 'user_id', as: 'family_dynamics', onDelete: 'cascade', hooks: true, allowNull: false});
db.UserFamilyDynamic.belongsTo(db.FamilyDynamic, {foreignKey: 'family_dynamic_id', as: 'family_dynamic', onDelete: 'cascade', hooks: true, allowNull: false});
db.User.hasMany(db.UserMatchingPreference, {foreignKey: 'user_id', as: 'user_matching_preferences', onDelete: 'cascade', hooks: true, allowNull: false});
db.Feedback.belongsTo(db.User, {foreignKey: 'user_id', as: 'feedback', onDelete: 'cascade', hooks: true, allowNull: false});
db.User.hasMany(db.ContactSupport, {foreignKey: 'user_id', as: 'contact_support', onDelete: 'cascade', hooks: true, allowNull: false});
db.User.hasMany(db.ListedPeer, {foreignKey: 'user_id', as: 'listed_peers', onDelete: 'cascade', hooks: true, allowNull: false});
//db.User.hasMany(db.DelistedPeer, {foreignKey: 'user_id', as: 'user'});
db.User.hasOne(db.UserHealthJourney, {foreignKey: 'user_id', as: 'user_health_journey', onDelete: 'cascade', hooks: true, allowNull: false});

module.exports = db;
