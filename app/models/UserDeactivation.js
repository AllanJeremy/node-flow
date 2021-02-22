'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDeactivation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserDeactivation.init({
    user_id: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    is_allow_to_contact: DataTypes.INTEGER,
    contact_email: DataTypes.STRING,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserDeactivation',
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return UserDeactivation;
  
};