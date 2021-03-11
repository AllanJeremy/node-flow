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
db.WorkoutUser = require('../models/WorkoutUser.js')(sequelize, Sequelize);
db.HealthCategoryUser = require('../models/HealthCategoryUser.js')(sequelize, Sequelize);
db.VerificationCode = require('../models/VerificationCode.js')(sequelize, Sequelize);
db.ResetPassword = require('../models/ResetPassword.js')(sequelize, Sequelize);

module.exports = db;
