'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ErrorLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ErrorLog.init({
    user_id: DataTypes.INTEGER,
    error: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'ErrorLog',
    tableName: 'error_logs',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return ErrorLog;
};
