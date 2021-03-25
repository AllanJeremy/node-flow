'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportedUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ReportedUser.init({
    user_id: DataTypes.INTEGER,
    reported_by: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM,
      values: ['reported', 'flagged']
    },
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReportedUser',
    tableName: 'reported_users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return ReportedUser;
};