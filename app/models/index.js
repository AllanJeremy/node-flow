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

module.exports = db;