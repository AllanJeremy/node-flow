'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VerifyUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  VerifyUser.init({
    user_id: DataTypes.INTEGER,
    verification_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'VerifyUser',
    tableName: 'verify_users',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return VerifyUser;
};
