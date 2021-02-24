const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DATABASE,
    config.USER,
    config.PASSWORD,
    {
      host: config.HOST,
      dialect: config.dialect,
      operatorsAliases: false,
      camelCase: true,
      camelCaseForFileName: true,
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

db.adminuser = require("../models/AdminUser.js")(sequelize, Sequelize);
db.race = require("../models/Race.js")(sequelize, Sequelize);
db.admin_permission = require("../models/AdminPermission.js")(sequelize, Sequelize);
db.gender = require("../models/Gender.js")(sequelize, Sequelize);
db.sexual_orientation = require("../models/SexualOrientation.js")(sequelize, Sequelize);
db.workout = require("../models/Workout.js")(sequelize, Sequelize);
db.health_category = require("../models/HealthCategory.js")(sequelize, Sequelize);

module.exports = db;