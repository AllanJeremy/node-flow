'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPeerMatchingSettings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserPeerMatchingSettings.init({
    user_id: DataTypes.INTEGER,
    matching_option: DataTypes.STRING,
    matching_value: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserPeerMatchingSettings',
  });

  return UserPeerMatchingSettings;
  
};