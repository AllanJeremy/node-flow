'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AdminUser.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.INTEGER,
    remember_token: DataTypes.STRING,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'AdminUser',
    tableName: 'admin_users',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return AdminUser;
  
};