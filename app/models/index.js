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
db.UserDetail = require('../models/UserDetail.js')(sequelize, Sequelize);
db.UserWorkout = require('../models/UserWorkout.js')(sequelize, Sequelize);
db.UserHealthCategory = require('../models/UserHealthCategory.js')(sequelize, Sequelize);
db.VerifyUser = require('../models/VerifyUser.js')(sequelize, Sequelize);
db.ResetPassword = require('../models/ResetPassword.js')(sequelize, Sequelize);
db.PersonalityQuestion = require('../models/PersonalityQuestion.js')(sequelize, Sequelize);
db.UserPersonalityQuestion = require('../models/UserPersonalityQuestion.js')(sequelize, Sequelize);


// relationships
db.User.hasOne(db.UserDetail, {foreignKey: 'user_id'});
db.UserDetail.belongsTo(db.Race, {foreignKey: 'race_id'});
db.UserDetail.belongsTo(db.Gender, {foreignKey: 'gender_id'});
db.UserDetail.belongsTo(db.SexualOrientation, {foreignKey: 'sexual_orientation_id'});
db.UserDetail.belongsTo(db.FamilyDynamic, {foreignKey: 'family_detail_id'});
db.User.hasMany(db.UserHealthCategory, {foreignKey: 'user_id', as: 'health_categories'});
db.UserHealthCategory.belongsTo(db.HealthCategory, {foreignKey: 'health_category_id', as: 'health_category'});
db.User.hasMany(db.UserWorkout, {foreignKey: 'user_id', as: 'workouts'});
db.UserWorkout.belongsTo(db.Workout, {foreignKey: 'workout_id', as: 'workout'});
db.User.hasMany(db.UserPersonalityQuestion, {foreignKey: 'user_id', as: 'personality_questions'});
db.UserPersonalityQuestion.belongsTo(db.PersonalityQuestion, {foreignKey: 'question_id', as: 'personality_question'});

module.exports = db;
