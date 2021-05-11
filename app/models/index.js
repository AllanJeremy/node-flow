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

// relationships
db.User.hasOne(db.UserMetadata, {foreignKey: 'user_id', as: 'user_meta_data'});
db.UserMetadata.belongsTo(db.Race, {foreignKey: 'race_id', onDelete: 'cascade', hooks: true});
db.UserMetadata.belongsTo(db.Gender, {foreignKey: 'gender_id', onDelete: 'cascade', hooks: true});
db.UserMetadata.belongsTo(db.SexualOrientation, {foreignKey: 'sexual_orientation_id', onDelete: 'cascade', hooks: true});
db.UserMetadata.belongsTo(db.FamilyDynamic, {foreignKey: 'family_detail_id', onDelete: 'cascade', hooks: true});
db.User.hasMany(db.UserHealthCategory, {foreignKey: 'user_id', as: 'health_categories', onDelete: 'cascade', hooks: true});
db.UserHealthCategory.belongsTo(db.HealthCategory, {foreignKey: 'health_category_id', as: 'health_category', onDelete: 'cascade', hooks: true});
db.User.hasMany(db.UserWorkout, {foreignKey: 'user_id', as: 'workouts', onDelete: 'cascade', hooks: true});
db.UserWorkout.belongsTo(db.Workout, {foreignKey: 'workout_id', as: 'workout', onDelete: 'cascade', hooks: true});
db.User.hasMany(db.UserPersonalityQuestion, {foreignKey: 'user_id', as: 'personality_questions'});
db.UserPersonalityQuestion.belongsTo(db.PersonalityQuestion, {foreignKey: 'question_id', as: 'personality_question'});
db.User.hasMany(db.UserConversationStarter, {foreignKey: 'user_id', as: 'conversation_starters'});
db.UserConversationStarter.belongsTo(db.ConversationStarter, {foreignKey: 'conversation_starter_id', as: 'conversation_starter'});
db.User.hasOne(db.UserInterest, {foreignKey: 'user_id', as: 'user_interest'});
db.ListedPeer.belongsTo(db.User, {foreignKey: 'peer_id', as: 'peer'});
db.ReportedUser.belongsTo(db.User, {foreignKey: 'user_id', as: 'reported_user'});
db.ReportedUser.belongsTo(db.User, {foreignKey: 'reported_by', as: 'reported_by_user'});
db.User.hasMany(db.UserRace, {foreignKey: 'user_id', as: 'races', onDelete: 'cascade', hooks: true});
db.UserRace.belongsTo(db.Race, {foreignKey: 'race_id', as: 'race', onDelete: 'cascade', hooks: true});

module.exports = db;
