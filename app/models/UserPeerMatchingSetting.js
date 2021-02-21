'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPeerMatchingSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserPeerMatchingSetting.init({
    user_id: DataTypes.INTEGER,
    matching_option: DataTypes.STRING,
    matching_value: DataTypes.STRING,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserPeerMatchingSetting',
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return UserPeerMatchingSetting;
  
};