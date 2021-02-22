'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AdminPermission.init({
    user_id: DataTypes.INTEGER,
    permissions: DataTypes.JSON,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'AdminPermission',
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return AdminPermission;
  
};