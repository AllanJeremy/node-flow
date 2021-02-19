'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSettings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserSettings.init({
    user_id: DataTypes.INTEGER,
    language: DataTypes.STRING,
    theme_color: DataTypes.STRING,
    font_size: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserSettings',
  });

  return UserSettings;
  
};